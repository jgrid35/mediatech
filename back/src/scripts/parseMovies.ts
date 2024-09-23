import { getMovieList, uploadEmptyFile } from "../ftps.js";
import { getMovieMetadataByID, getMovieMetadataByTitle } from "../movie.js";
import { Movie } from "../types/movieSchema.js";
import { MovieAttributes, MovieMetadata } from "../types/omdb.js";

export async function parseMovies() {
    const movies: Array<{ title: string, imdbID?: string, fileName?: string, srtFileName?: string }> = await getMovieList();
    for (const movie of movies) {
        let movieMetadata: MovieMetadata;
        if (movie.imdbID && movie.imdbID === 'notfound') continue;
        if (movie.imdbID) {
            const isInDatabase = await Movie.findOne({ where: { imdbID: movie.imdbID }, attributes: ['imdbID'] });
            if (isInDatabase) continue;
        }
        movieMetadata = movie.imdbID ? await getMovieMetadataByID(movie.imdbID) : await getMovieMetadataByTitle(movie.title);
        let movieObject: MovieAttributes = { ...movieMetadata, folder: movie.title, fileName: movie.fileName, available: true, srtFileName: movie.srtFileName };

        if (movieMetadata.Response === 'True') await Movie.create(movieObject as any);
        await uploadEmptyFile(movieMetadata.Response === 'True' ? `${movieMetadata.imdbID}` : 'notfound', movie.title);
    }
    return true;
}