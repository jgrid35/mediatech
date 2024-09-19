
import { config } from './config.js';
import { GetMovieResponse, MovieMetadata } from "types/omdb.js";
import { readFileSync } from 'fs';

const omdbapiSecretPath = `/run/secrets/omdbapi_secret`;
const apiKey = config.omdb.apiKey ? config.omdb.apiKey : readFileSync(omdbapiSecretPath, 'utf8');
const omdbApi = `https://www.omdbapi.com/?apikey=${apiKey}&`;

type GetMovieMetadata = (movie: string) => Promise<GetMovieResponse>
export const getMovieMetadata: GetMovieMetadata = async (movie) => {
    let movieMetadata: MovieMetadata;
    const url = omdbApi + new URLSearchParams({ t: movie });
    const res = await fetch(url);
    movieMetadata = await res.json();

    const getMovieResponse:GetMovieResponse = {...movieMetadata, folder: movie}
    return getMovieResponse;
}