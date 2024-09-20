import { getDbConnection } from "../mongodb.js";
import { getMovieList, uploadEmptyFile } from "../ftps.js";
import { getMovieMetadataByID, getMovieMetadataByTitle } from "../movie.js";
import { MovieCollection } from "../types/movieSchema.js";
import { GetMovieResponse, MovieMetadata } from "types/omdb.js";
import cron from 'node-cron';
import { config } from "../config.js";

export const startWorker = () => {
    console.log("starting worker ...");
    cron.schedule('0 * * * *', async function() {
        console.log("launching cron");
        getDbConnection(config.mongodb.uri);
        const movies: Array<{ title: string, imdbID?: string, fileName: string }> = await getMovieList();
        for (const movie of movies) {
            let movieMetadata: MovieMetadata;
            if (movie.imdbID && movie.imdbID === 'notfound') continue;
            if (movie.imdbID) {
                const isInDatabase = await MovieCollection.findOne({ imdbID: movie.imdbID }, { imdbID: 1 });
                if (isInDatabase) continue;
            }
            movieMetadata = movie.imdbID ? await getMovieMetadataByID(movie.imdbID) : await getMovieMetadataByTitle(movie.title);
            let movieObject: GetMovieResponse = { ...movieMetadata, folder: movie.title, fileName: movie.fileName, available: true };

            if (movieMetadata.Response === 'True') await MovieCollection.create(movieObject);
            await uploadEmptyFile(movieMetadata.Response === 'True' ? `${movieMetadata.imdbID}` : 'notfound', movie.title);
        }
    });
}