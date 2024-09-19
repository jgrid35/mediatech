import { useState, useEffect, CSSProperties } from 'react';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';

interface CellRendererProps {
    columnIndex: number;
    key: string;
    rowIndex: number;
    style: CSSProperties;
}

const MovieGrid = () => {
    const [movies, setMovies] = useState([]);   // State to store movies
    const [loading, setLoading] = useState(true);  // State to show loading
    const [error, setError] = useState(null);  // State to handle errors

    const url = process.env.REACT_APP_BACK_URL;

    const handleClick = async (folder: string) => {
        try {
            window.open(`http://${url}:3001/download/${folder}`)
        } catch (err) {
        }
    };


    function cellRenderer({ columnIndex, key, rowIndex, style }: CellRendererProps) {
        return (
            <div key={key} style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${(movies[rowIndex * 4 + columnIndex] as any).Poster})`
            }}>
                {(movies[rowIndex * 4 + columnIndex] as any).Title}
                <button onClick={() => handleClick((movies[rowIndex * 4 + columnIndex] as any).folder)}>Download</button>
            </div>
        );
    }

    useEffect(() => {
        // Fetch movies only once when the component is mounted
        const fetchMovies = async () => {
            try {
                const response = await fetch(`http://${url}:3001/movies`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMovies(data);  // Set the movie data
            } catch (error: any) {
                setError(error.message);  // Catch and store error if occurs
            } finally {
                setLoading(false);  // Set loading to false when the fetch is complete
            }
        };

        fetchMovies();  // Trigger the API call

    }, []);  // Empty dependency array ensures it runs only on mount

    if (loading) {
        return <div>Loading...</div>;  // Show loading state
    }

    if (error) {
        return <div>Error: {error}</div>;  // Show error if any
    }

    // Render your grid
    return (
        <ScrollSync>
            {({ onScroll, scrollTop, scrollLeft }) => (
                <AutoSizer>
                    {({ height, width }) => (
                        <Grid
                            cellRenderer={cellRenderer}
                            columnCount={4}
                            columnWidth={300}
                            onScroll={onScroll}
                            rowCount={movies.length / 4}
                            rowHeight={300}
                            height={height}
                            width={width}
                        />
                    )}
                </AutoSizer>
            )
            }
        </ScrollSync>
    );
};



export default MovieGrid;
