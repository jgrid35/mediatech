import express from 'express';
import https from 'https';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import sanitize from 'sanitize-filename';
import { downloadMovie, uploadEmptyFile } from './ftps.js'
import { MovieMetadata } from 'types/omdb.js';
import { config } from './config.js';
import { readFileSync } from 'fs';
import { MovieCollection } from './types/movieSchema.js';
import { getDbConnection } from './mongodb.js';
import { authenticateToken, authenticateTokenDownload } from './middleware/auth.js';
import { Users } from './types/userSchema.js';
import { getMovieMetadataByID } from './movie.js';
import { startWorker } from './workers/moviesWorker.js';

startWorker();
const app = express();

getDbConnection(config.mongodb.uri);

if (config.env === "dev") {
    await Users.findOneAndUpdate({ username: "admin" }, { username: "admin", password: await bcrypt.hash("password", 10) }, { upsert: true });
}

// Secret key for JWT (in a real-world app, store this securely in an environment variable)
const jwtSecret = config.server.jwtSecret ? config.server.jwtSecret : readFileSync('/run/secrets/jwt_secret', 'utf8').trim();


if (config.server.https) {
    const privateKey = readFileSync(`/run/secrets/private_key`, 'utf8').trim();
    const certificate = readFileSync(`/run/secrets/certificate`, 'utf8').trim();
    const credentials = { key: privateKey, cert: certificate };

    // Create an HTTPS server
    const httpsServer = https.createServer(credentials, app);

    // Start the server
    httpsServer.listen(3001, () => {
        console.log('Server running on https://localhost:3001');
    });
}
else {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
}

app.use(cors({
    origin: '*',  // Restrict to your front-end origin
    methods: 'GET,POST,PUT,DELETE,OPTIONS',  // Allow necessary methods
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'  // Include any required headers
}));
// app.options('*', cors()); 
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = await Users.findOne({ username: username });
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, jwtSecret, {
        expiresIn: '1h' // Token expires in 1 hour
    });

    // Send token back to the client
    res.json({ token });
});

app.get("/movies", authenticateToken, async (req: express.Request, res: express.Response) => {
    let moviesMetadata: Array<MovieMetadata>;
    moviesMetadata = await MovieCollection.find();
    res.status(200).send(moviesMetadata);
});

app.post("/movie/:imdbID", authenticateToken, async (req: express.Request, res: express.Response) => {
    const imdbID = req.params.imdbID;
    const isMovieInDB = await MovieCollection.findOne({ imdbID }, { imdbID: 1 });
    if (isMovieInDB) return res.status(200).send("Movie already exists");

    const movieMetadata = await getMovieMetadataByID(imdbID);

    if (movieMetadata.Response === 'False') return res.status(404).send(`Cannot find movie with ID ${imdbID}`);

    const folder = sanitize(movieMetadata.Title)
    await MovieCollection.create({ ...movieMetadata, folder, fileName: '', available: false });
    await uploadEmptyFile(imdbID, folder)
    return res.status(200).send("Movie created !");
});



app.get("/download/:imdbID", authenticateTokenDownload, async (req: express.Request, res: express.Response) => {
    try {
        const movieMetadata = await MovieCollection.findOne({ imdbID: req.params.imdbID }, { folder: 1, fileName: 1 });
        const filePath = path.join(config.freebox.folder, movieMetadata.folder, movieMetadata.fileName);
        // Set appropriate headers for download
        res.setHeader("Content-Disposition", `attachment; filename="${movieMetadata.fileName}"`);
        res.setHeader("Content-Type", "application/octet-stream");

        await downloadMovie(res, filePath);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error downloading file");
    }
});