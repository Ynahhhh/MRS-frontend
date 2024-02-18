// Inside Reservation component
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { Link } from 'react-router-dom';


import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import styled from '@emotion/styled';

const MovieDetail = styled(Box)({
    borderRadius: '10px',
    padding: '25px'
});

const MovieImage = styled(Box)({
   
});

const MoreDetails = styled(Typography)({
    display: 'flex',
    marginTop: '5px',
});

const LegendBox = styled(Box)({
    height: '30px',
    width: '30px',
    padding: '5px',
    marginRight: '10px',
    marginBottom: '10px'
});

const Legend = styled(Box)({
    display: 'flex',
    marginTop: '5px'
});

const SummaryTypography = styled(Typography)({
    marginBottom: '5px'
});

function SeatLayout() {
    // GET THE DATA FROM URL
    const movieId = window.location.pathname.split('/')[2];    


    return (
        <Box>
            <Box className="movie-cont" style={{ display: 'flex', justifyContent:'space-between' }}>
                <MovieDetail className="movie-details" style={{ width: '55%' }}>
                    <Box style={{ display: 'flex', justifyContent:'space-between'}}>
                        {/* DISPLAY MOVIE, DETAILS AND LEGEND */}
                        
                    </Box>
                    <Box>
                        <Box style={{ display: 'flex', justifyContent: 'space-between'}} >

                            {/* COMMENT OUT -- THIS FOR THE MEAN TIME  */}
                            <Box className="summary">
                                <Typography variant='h6' style={{ marginTop: '15px', marginBottom: '15px'}} ><b>SEAT SUMMARY</b></Typography>
                                <SummaryTypography > Available Seats: 30</SummaryTypography>
                                <SummaryTypography > Reserved Seats: 10</SummaryTypography>
                                <Divider style={{background:'#0D99FF', marginTop: '10px' }}/>
                                <SummaryTypography  style={{ marginTop: '10px'}}> Total Number of Seats: 40</SummaryTypography>
                            </Box>

                           
                            <Box className="legend">
                                <Typography variant='h6' style={{ marginTop: '15px', marginBottom: '15px'}} ><b>LEGEND</b></Typography>
                                <Legend >
                                    <LegendBox style={{background:'#388e3c'}}></LegendBox>
                                    <Typography>Available Seats</Typography>
                                </Legend>
                                <Legend >
                                    <LegendBox style={{background:'#f57c00'}}></LegendBox>
                                    <Typography>Unvailable Seats </Typography>
                                </Legend>
                                <Legend >
                                    <LegendBox style={{background:'#0288d1'}}></LegendBox>
                                    <Typography>Selected Seats </Typography>
                                </Legend>
                                
                            </Box>
                        </Box>
                    </Box>
                </MovieDetail>

                {/*  {/* DISPLAY THE SEAT LAYOUT */} 
                <Box className="seat-details" style={{ width: '40%', background:'#fff', borderRadius: '10px', textAlign: 'center', padding: '25px' }}>
                    <Typography></Typography>
                    <Box mb={2}>SCREEN</Box>
                    <Box style={{ width: '400px', margin: '0 auto' }}>
                        This is a seat
                    </Box>
                    <Box style={{display: 'flex', justifyContent: 'space-between', marginTop: "2px"}}>
                        <Box>EXIT</Box> <Box>ENTRANCE</Box>
                    </Box>
        
                    <Box>
                        {/* <Button 
                            variant="outlined"  
                            component={Link} 
                            to={`/details/${movieId}${selectedSeats.length > 0 ? `/${JSON.stringify(selectedSeats)}` : ''}`}
                            style={{ width: '100%', marginTop: '30px' }}
                        >
                            Proceed to Reservation
                        </Button> */}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default SeatLayout;
