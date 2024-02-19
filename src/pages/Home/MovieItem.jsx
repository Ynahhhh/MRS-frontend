import React from 'react';
import styled from "@emotion/styled";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Link } from 'react-router-dom';

// STYLING


const MPATypography = styled(Typography)({
  padding: '6px',
  background: '#000',
  color: '#fff',
  marginRight: '15px',
  width: '70px',
  alignContent: 'center',
  textAlign: 'center'
});

const MovieDetails = styled(Box)({
  marginTop: '10px'
});

const MoreTypography = styled(Typography)({
  marginTop: '10px'
});

// Format time function to format date
const formatTime = (date) => {
  // Add your date formatting logic here
  return date.toLocaleDateString();
};

// MOVIE ITEM COMPONENT
const MovieItem = ({ movie }) => {
  const startDate = new Date(movie.startdate);
  const endDate = new Date(movie.enddate);
  return (
    <React.Fragment key={movie.m_title}>
      <Divider />
      <Box className="movie" style={{ display: 'flex', marginBottom: '20px' }}>
      <Box className="movie-image" style={{ width: '20%' }}>
      <img src={`/${movie.m_poster}`}  alt={`${movie.m_title}`} style={{ width: '150px', height: '200px' }} />
    </Box>

        <Box className="movie-detail" style={{ width: '80%' }}>
          <Box style={{ display: 'flex' }}>
            <MPATypography>{movie.m_mpa}</MPATypography>
            <Typography variant="h6">{movie.m_title}</Typography>
          </Box>
          <MovieDetails>{movie.m_desc}</MovieDetails>
          <MoreTypography>
            <b>Genre:</b> {movie.m_genre} <b>|</b> <b>Duration:</b> {movie.m_hrs} hrs
            <b> | Now Showing  </b> {formatTime(startDate)} - {formatTime(endDate)}
          </MoreTypography>
          <Box>
            <Button component={Link} to={`/movies/${movie.m_id}`}>More Details</Button>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default MovieItem;
