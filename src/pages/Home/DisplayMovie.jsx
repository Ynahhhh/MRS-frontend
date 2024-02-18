import React, { useState, useEffect } from 'react';

function DisplayMovie() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:5555/api/movies/');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  return (
    <div>
      <h1>Movies List</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie._id}>
            <h2>{movie.m_title}</h2>
            <p>{movie.m_desc}</p>
            <p>Genre: {movie.m_genre}</p>
            <p>MPA: {movie.m_mpa}</p>
            <p>Duration: {movie.m_hrs} hours</p>
            <img src={movie.m_poster} alt={movie.m_title} style={{ maxWidth: '200px' }} />
            <p>Start Date: {new Date(movie.startdate).toLocaleDateString()}</p>
            <p>End Date: {new Date(movie.enddate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayMovie;
