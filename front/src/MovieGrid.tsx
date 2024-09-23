import { useState, useEffect, CSSProperties } from 'react';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';
import './MovieGrid.css';
import MovieDetails from './MovieDetails';

interface CellRendererProps {
    columnIndex: number;
    key: string;
    rowIndex: number;
    style: CSSProperties;
    columnCount: number;
}

export type MovieMetadata = {
    Title: string,
    Year?: string,
    Rated?: string,
    Released?: string,
    Runtime?: string,
    Genre?: string,
    Director?: string,
    Writer?: string,
    Actors?: string,
    Plot?: string,
    Language?: string,
    Country?: string,
    Awards?: string,
    Poster?: string,
    Ratings?: Array<{ Source: string, Value: string }>,
    Metascore?: string,
    imdbRating?: string,
    imdbVotes?: string,
    imdbID?: string,
    Type?: string,
    DVD?: string,
    BoxOffice?: string,
    Production?: string,
    Website?: string,
    Response?: string,
    folder: string,
    fileName?: string,
    srtFileName?: string,
    available: boolean
};

const MovieGrid = () => {
    const [movies, setMovies] = useState<Array<MovieMetadata>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [selectedMovie, setSelectedMovie] = useState<MovieMetadata | null>(null);

    const url = process.env.REACT_APP_BACK_URL;
    const protocol = process.env.REACT_APP_HTTPS === 'true' ? 'https' : 'http';

    const handleAddMovie = async () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const regex = /tt\d{1,}/;
            const match = urlInput.match(regex) || '';
            const response = await fetch(`${protocol}://${url}:3001/movie/${match[0]}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                setUrlInput('');
                setShowPopup(false);
            } else {
                console.error("Failed to add movie");
            }
        }
    };

    const handleDownload = async (imdbID: string) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const encodedToken = encodeURIComponent(token);
            window.open(`${protocol}://${url}:3001/download/${imdbID}?token=${encodedToken}`);
        } else {
            console.error("No access token available");
        }
    };

    const handleClick = (imdbID: string) => {
        const movie = movies.find((movie) => movie.imdbID === imdbID);
        if (movie) setSelectedMovie(movie); // Set the selected movie on click
    };

    const handleSubtitleDownload = async (imdbID: string) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const encodedToken = encodeURIComponent(token);
            window.open(`${protocol}://${url}:3001/download/${imdbID}/srt?token=${encodedToken}`);
        } else {
            console.error("No access token available");
        }
    };

    const handleClosePanel = () => {
        setSelectedMovie(null); // Close the details panel
    };

    function cellRenderer({ columnIndex, key, rowIndex, style, columnCount }: CellRendererProps) {
        const movieIndex = rowIndex * columnCount + columnIndex;
        const movie = movies[movieIndex] as any;

        if (!movie) {
            return (
                <div
                    key={key}
                    style={{
                        ...style,
                        opacity: 0 // Placeholder background
                    }}
                >
                    No Movie
                </div>
            );
        }

        const isAvailable = movie.available; // Check availability

        return (
            <div
                onClick={() => handleClick(movie.imdbID || '')}
                key={key}
                className={`movie-cell ${!isAvailable ? 'not-available' : ''}`} // Add class if not available
                style={{
                    ...style,
                    backgroundImage: `url(${movie.Poster})`,
                    backgroundSize: 'cover',
                    width: '280px',
                    height: '380px',
                    pointerEvents: isAvailable ? 'auto' : 'none', // Disable pointer events if not available
                }}
            >
                <div className="movie-title">{movie.Title}</div>
                {isAvailable && ( // Only render buttons if available
                    <>
                        {/* <button className="download-button" onClick={() => handleDownload(movie.imdbID)}>Download Movie</button> */}
                        {/* {movie.srtFileName && <button className="subtitle-button" onClick={() => handleSubtitleDownload(movie.imdbID)}>Download Subtitle</button>} */}
                    </>
                )}
            </div>
        );
    }

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetch(`${protocol}://${url}:3001/movies`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch movies');
                const data = await response.json();
                setMovies(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {!selectedMovie ? (
                <ScrollSync>
                    {({ onScroll }) => (
                        <AutoSizer>
                            {({ height, width }) => {
                                const columnCount = Math.floor(width / 300); // Calculate columnCount based on width

                                return (
                                    <Grid
                                        cellRenderer={(props) => cellRenderer({ ...props, columnCount })} // Pass columnCount to cellRenderer
                                        columnCount={columnCount}
                                        columnWidth={300}
                                        height={height}
                                        rowCount={Math.ceil(movies.length / columnCount)} // Adjust row count
                                        rowHeight={400}
                                        width={width}
                                        onScroll={onScroll}
                                    />
                                );
                            }}
                        </AutoSizer>
                    )}

                </ScrollSync>

            ) : (
                <MovieDetails
                    movie={selectedMovie}
                    onClose={handleClosePanel}
                    onDownload={handleDownload}
                    onSubtitleDownload={handleSubtitleDownload}
                />
            )}
            <div>
                <button
                    className="add-movie-button"
                    onClick={() => setShowPopup(true)}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#61dafb',
                        color: '#282c34',
                        border: 'none',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        fontSize: '24px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                >
                    +
                </button>

                {showPopup && (
                    <div className="popup">
                    <div className="popup-content">
                        <h2>Add Movie</h2>
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="Enter movie URL"
                        />
                        <button className="interface-button" onClick={handleAddMovie}>Confirm</button>
                        <button className="interface-button" onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default MovieGrid;

