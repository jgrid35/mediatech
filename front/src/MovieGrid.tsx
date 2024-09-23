import { useState, useEffect, CSSProperties } from 'react';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';
import './MovieGrid.css';

interface CellRendererProps {
    columnIndex: number;
    key: string;
    rowIndex: number;
    style: CSSProperties;
    columnCount: number;
}

const MovieGrid = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [urlInput, setUrlInput] = useState('');

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

    const handleClick = async (imdbID: string) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const encodedToken = encodeURIComponent(token);
            window.open(`${protocol}://${url}:3001/download/${imdbID}?token=${encodedToken}`);
        } else {
            console.error("No access token available");
        }
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
                        <button className="download-button" onClick={() => handleClick(movie.imdbID)}>Download Movie</button>
                        {movie.srtFileName && <button className="subtitle-button" onClick={() => handleSubtitleDownload(movie.imdbID)}>Download Subtitle</button>}
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

            {/* Floating Add Movie Button */}
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

            {/* Popup for adding a movie */}
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
                        <button className="download-button" onClick={handleAddMovie}>Confirm</button>
                        <button className="subtitle-button" onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieGrid;
