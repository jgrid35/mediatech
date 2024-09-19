import express from 'express';
import { downloadMovie, getMovieList } from './ftps.js'
import cors from 'cors';
import bodyParser from 'body-parser';
import { MovieMetadata } from 'types/omdb.js';
import { getMovieMetadata } from './movie.js';
import { testData } from './test-data.js'
import { config } from './config.js';

const app = express();
app.use(cors({
    origin: '*',  // Restrict to your front-end origin
    methods: 'GET,POST,PUT,DELETE,OPTIONS',  // Allow necessary methods
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'  // Include any required headers
}));
// app.options('*', cors()); 
app.use(bodyParser.json());


app.get("/movies", async (req: express.Request, res: express.Response) => {
    let moviesMetadata: Array<MovieMetadata> = [];
    const movies = await getMovieList();
    moviesMetadata = testData;
    // for (const movie of movies) {
    //     let movieMetadata = await getMovieMetadata(movie);
    //     if (movieMetadata.Response === 'True'){
    //         moviesMetadata.push(movieMetadata);
    //     }
    //     else {
    //         moviesMetadata.push({Title: movie, folder: movie} as MovieMetadata);
    //     }
    // }
    res.status(200).send(moviesMetadata);
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});


app.get("/download/:filename", async (req: express.Request, res: express.Response) => {
    try {
        const filePath = encodeURI(`${config.freebox.folder}/${req.params.filename}`);
        // Set appropriate headers for download
        res.setHeader("Content-Disposition", `attachment; filename="${req.params.filename}"`);
        res.setHeader("Content-Type", "application/octet-stream");

        await downloadMovie(res, filePath);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error downloading file");
    }
});