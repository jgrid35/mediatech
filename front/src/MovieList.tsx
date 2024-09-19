import React, { useState, useEffect } from 'react';
import { Grid } from 'react-virtualized';


const MovieList = () => {
  const [movies, setMovies] = useState([]);   // State to store movies
  const [loading, setLoading] = useState(true);  // State to show loading
  const [error, setError] = useState(null);  // State to handle errors

  useEffect(() => {
    // Fetch movies only once when the component is mounted
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:3001/movies');
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

  return (
    <div>
      <h1>Movie List</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie}>{movie}</li>  // Display each movie title
        ))}
      </ul>
    </div>
  );
};

export default MovieList;