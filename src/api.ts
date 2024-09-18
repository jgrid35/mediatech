import express from 'express';
import {ftpConnect} from './ftps.js'
import { Client } from 'basic-ftp';

const app = express();

app.get("/download/:filename", async (req: express.Request, res: express.Response) => {
    const client: Client = await ftpConnect();
    try {
        const filePath = `/path/to/${req.params.filename}`;
        // Set appropriate headers for download
        res.setHeader("Content-Disposition", `attachment; filename="cobweb.mkv"`);
        res.setHeader("Content-Type", "application/octet-stream");
        
        // Stream file from FTPS to user via HTTPS
        await client.downloadTo(res, filePath);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error downloading file");
    } finally {
        client.close();
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});