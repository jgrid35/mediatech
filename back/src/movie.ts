
import { config } from './config.js';
import { MovieMetadata } from "types/omdb.js";
import { readFileSync } from 'fs';

const omdbapiSecretPath = `/run/secrets/omdbapi_secret`;
const apiKey = config.omdb.apiKey ? config.omdb.apiKey : readFileSync(omdbapiSecretPath, 'utf8').trim();
const omdbApi = `https://www.omdbapi.com/?apikey=${apiKey}&`;

type GetMovieMetadata = (param:string) => (movie: string) => Promise<MovieMetadata>
const getMovieMetadata: GetMovieMetadata = (param) => async (movie) => {
    let movieMetadata: MovieMetadata;
    const url = omdbApi + new URLSearchParams({ [param]: movie });
    const res = await fetch(url);
    movieMetadata = await res.json();

    return movieMetadata;
}

export const getMovieMetadataByID = getMovieMetadata('i');
export const getMovieMetadataByTitle = getMovieMetadata('t');