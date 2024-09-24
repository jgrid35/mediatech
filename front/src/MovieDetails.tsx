import React from 'react';
import './MovieDetails.css';
import { MovieMetadata } from './MovieGrid'; // Adjust import if needed

interface MovieDetailsProps {
    movie: MovieMetadata;
    onClose: () => void;
    onDownload: (imdbID: string) => void;
    onSubtitleDownload: (imdbID: string) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose, onDownload, onSubtitleDownload }) => {
    return (

        <div className="movie-details-panel">
            <button className="close-button" onClick={onClose}>X</button>
            <div className="movie-details-container">
                <img
                    className="movie-poster"
                    src={movie.Poster}
                    alt={`${movie.Title} poster`}
                />
                <div className="movie-details">
                    <h2>{movie.Title}</h2>
                    <p><strong>Year:</strong> {movie.Year}</p>
                    <p><strong>Director:</strong> {movie.Director}</p>
                    <p><strong>Writer:</strong> {movie.Writer}</p>
                    <p><strong>Actors:</strong> {movie.Actors}</p>
                    <p><strong>Plot:</strong> {movie.Plot}</p>
                    <p><strong>Language:</strong> {movie.Language}</p>
                    <p><strong>Country:</strong> {movie.Country}</p>
                    <p><strong>Genre:</strong> {movie.Genre}</p>
                    <p><strong>Runtime:</strong> {movie.Runtime}</p>
                    <p><strong>Rating:</strong> {movie.imdbRating}/10</p>
                </div>


            </div>
            <div className="movie-details-buttons">
                {movie.available === true && <button className="movie-details-download-button" onClick={() => onDownload(movie.imdbID || '')}>Download Movie</button>}
                {(movie.available === true && movie.srtFileName) && (
                    <button className="movie-details-download-button" onClick={() => onSubtitleDownload(movie.imdbID || '')}>
                        Download Subtitle
                    </button>
                )}
            </div>
        </div >
    );
};

export default MovieDetails;