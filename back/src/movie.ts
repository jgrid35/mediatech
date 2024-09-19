
import { config } from './config.js';
import { GetMovieResponse, MovieMetadata } from "types/omdb.js";

const apiKey = config.omdb.apiKey;
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