import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, Typography } from "@mui/material";
import styled from '@emotion/styled';
import MovieItem from './MovieItem';

const StyledPaper = styled(Paper)({
  maxHeight: 570,
  overflow: 'auto',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&::-webkit-scrollbar': {
    width: '0.4rem'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#ccc',
    borderRadius: '4px'
  }
});

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Initialize with today's date
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies(selectedDate);
  }, [selectedDate]);

  const fetchMovies = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5555/api/movies/?date=${date}`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="home">
      <Typography variant='h5' style={{paddingLeft:'20px', marginTop: '20px'}}>List of Movies</Typography>
      <Box className="movies-cont" style={{ display: 'flex' }}>
        <Box className="movie-list" style={{ width: '74%', padding: '20px' }}>
          <StyledPaper>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : movies.length === 0 ? (
              <Typography>No movies available</Typography>
            ) : (
              movies.map(movie => (
                <MovieItem key={movie._id} movie={movie} />
              ))
            )}
          </StyledPaper>
        </Box>
        <Box className="movie-option" style={{ width: '25%', paddingLeft: '15px' }}>
          <Box style={{ padding: '20px 15px', background: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <TextField
              id="date"
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputProps: {
                  min: new Date().toISOString().split('T')[0], // Set min date to today
                  disabled: new Date(selectedDate) < new Date().setHours(0, 0, 0, 0) // Disable if date is less than today
                }
              }}
              style={{ width: '100%' }}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Home;
