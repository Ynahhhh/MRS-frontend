import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, MenuItem, Paper, Select, Typography } from '@mui/material';
import styled from '@emotion/styled';
import AiringTimeDetails from './AiringTimeDetails';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const SeatBox = styled(Box)({
    display:'flex',
    justifyContent:'space-between'
});

const MoreDetails = styled(Box)({
    display: 'flex',
    marginTop: '5px',
    justifyContent: 'space-between'
});

const LegendBox = styled(Box)({
    height: '10px',
    width: '10px',
    padding: '5px',
    marginRight: '10px',
    marginTop:'5px'
});

const Legend = styled(Box)({
    display: 'flex',
    marginTop: '5px'
});

function Seat() {
    // GET THE DATA FROM URL
    const m_id = window.location.pathname.split('/')[2];   
    const [movie, setMovie] = useState({});
    const [uniqueDates, setUniqueDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [airingTimes, setAiringTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]); // State to hold selected seats
    
    const StyledPaper = styled(Paper)({
        maxHeight: 640,
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
    // timeslot

    useEffect(() => {
        fetchMovieById(m_id); 
        fetchUniqueDates(m_id);
    }, [m_id]);

    // FETCH MOVIE DETAILS OF MOVIE M_ID
    const fetchMovieById = async (m_id) => {
        try {
            const response = await fetch(`http://localhost:5555/api/movies/${m_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movie');
            }
            const data = await response.json();
            setMovie(data);
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    };

    // FETCH UNIQUE DATES OF MOVIE M_ID
    const fetchUniqueDates = async (m_id) => {
        try {
            const response = await fetch(`http://localhost:5555/api/movies/date/${m_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch unique dates');
            }
            const data = await response.json();
            setUniqueDates(data);
        } catch (error) {
            console.error('Error fetching unique dates:', error);
        }
    };


    // GET TIME SLOT
    useEffect(() => {
        if (selectedDate) {
            fetchAiringTimesData(m_id, selectedDate);
        }
    }, [m_id, selectedDate]);

    const fetchAiringTimesData = async (m_id, selectedDate) => {
        try {
            const response = await fetch(`http://localhost:5555/api/movies/${m_id}/${selectedDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch airing times');
            }
            const data = await response.json();
            setAiringTimes(data);
        } catch (error) {
            console.error('Error fetching airing times:', error);
        }
    };


    // Function to handle selected seats changes
    const handleSelectedSeatsChange = (seats) => {
        setSelectedSeats(seats);
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
        console.log(selectedTime);
    };

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    const handleChange = (event) => {
        setSelectedDate(event.target.value);
        setSelectedTime(null)
    };

    return (
        <SeatBox className="seat-cont" styled={{display: "flex", justifyContent: "space-between"}} >
            
            <Box className="movie-details" style={{width: "25%", alignItems:"center", textAlign: "center",paddingLeft:'20px', marginTop: '20px' }}>
            <StyledPaper>
                <Box className="movie-image" style={{ width: '100%' }}>
                    <Box className="movie-image" >
                        <img src={`/${movie.m_poster}`}  alt={movie.m_poster} style={{ width: '300px', height: '400px' }} />                           
                    </Box>
                </Box>
                    <Typography variant='h5'><b>{movie.m_title}</b></Typography>
                    <Divider style={{background:'#0D99FF', marginTop: '10px' }}/>
                    <Typography variant='body1' style={{marginTop:'10px' }}>{movie.m_desc}</Typography>
                    <Box style={{margin:'15px', marginTop: '10px'}}>
                        <MoreDetails> 
                            <Typography><b>GENRE: </b></Typography>
                            <Typography> {movie.m_genre}</Typography>
                        </MoreDetails>
                        <MoreDetails>
                            <Typography><b>MPA FILM RATING:</b></Typography>
                            <Typography> {movie.m_mpa}</Typography>
                        </MoreDetails>
                        <MoreDetails>
                            <Typography><b>DURATION:</b></Typography>
                            <Typography> {movie.m_hrs} hrs</Typography>
                        </MoreDetails>
                    </Box>
                    </StyledPaper>   
            </Box>
            
            <Box className="chair-details" style={{ width: "45%", marginTop: '20px', padding: '20px 15px', background: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' , height: '85vh', padding: '20px' }}>
           
            {selectedTime === null && (
                <Typography style={{alignContent:"center", textAlign:"center", marginTop: "250px"}}> 
                    Select time slot first to display seat layout.
                </Typography>
            )}
                <Box style={{width:'100%'}}>
                    <AiringTimeDetails selectedTime={selectedTime} onSelectedSeatsChange={handleSelectedSeatsChange} />

                </Box>

            </Box>
            <Box className="seat-tab" style={{width: "25%", padding: '30px'}}>
                <StyledPaper>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom:'20px' }}>
                <Button
                    variant="text"
                    size="medium"
                    color="inherit"
                    component={Link}
                    to="/"
                >
                    <ArrowBackIcon/>
                    Go Back
                </Button>
                </div>


                {/* SELECT DATE */}
                <Typography variant='h6' style={{alignContent:"center", textAlign:"center", margingTop:"30px", fontWeight:"600" }}>TIME SLOT SECTION</Typography>
                <Select
                    value={selectedDate}
                    onChange={handleChange}
                    displayEmpty
                    fullWidth
                    style={{marginTop: "15px"}}
                >
                    <MenuItem value="" disabled>
                        <em>Select a date</em>
                    </MenuItem>
                    {uniqueDates.map((date, index) => {
                        const currentDate = new Date();
                        const menuItemDate = new Date(date);
                        const yesterday = new Date();
                        yesterday.setDate(currentDate.getDate() - 1); // Get yesterday's date
                        const isDisabled = menuItemDate <= yesterday;

                        return (
                            <MenuItem
                                key={index}
                                value={date}
                                disabled={isDisabled}
                            >
                                {menuItemDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </MenuItem>
                        );
                    })}
                </Select>
                {/* SELECT TIME SLOT */}
                <Box style={{ marginTop: '25px'}}>
                {selectedTime && (
                <Typography variant='body1' style={{marginBottom: '10px',alignContent:"center", textAlign:"center", margingTop:"30px", fontWeight:"600" }}>
                    {`Time: ${formatTime(selectedTime.a_starttime)} - ${formatTime(selectedTime.a_endtime)} `}
                </Typography>
                )}
                {selectedDate === "" && (
                    <Typography style={{marginTop:'-20px', textAlign:"center"}} variant='body2'>
                        Select date to display time slot {selectedDate}
                    </Typography>
                )}
                    {Array.isArray(airingTimes) && airingTimes.map((time) => {
                        const startTime = new Date(time.a_starttime);
                        const isDisabled = startTime <= new Date();
                        return (
                            <Button
                                key={time.a_id}
                                value={time.a_id}
                                onClick={() => handleTimeSelection(time)}
                                disabled={isDisabled} 
                                style={{ backgroundColor: isDisabled ? 'secondary' : 'primary', marginBottom: '10px', width:'100%' }} // Change color based on disabled state

                                variant='contained'
                            >
                                {`${time.a_type} : ${formatTime(time.a_starttime)} - ${formatTime(time.a_endtime)}`}
                            </Button>
                        );
                    })}
                </Box>
                </StyledPaper>

                {/*  */}
                <Box style={{ marginTop:'20px', padding: '0 20px'}}>
                    <Typography><b>LEGEND</b></Typography>
                    <Legend >
                        <LegendBox style={{background:'#388e3c'}}></LegendBox>
                        <Typography variant='caption'>Available Seats</Typography>
                    </Legend>
                    <Legend >
                        <LegendBox style={{background:'#f57c00'}}></LegendBox>
                        <Typography variant='caption'>Unavailable Seats </Typography>
                    </Legend>
                    <Legend >
                        <LegendBox style={{background:'#0288d1'}}></LegendBox>
                        <Typography variant='caption'>Selected Seats </Typography>
                    </Legend>
                </Box>
            </Box>
            
        </SeatBox>
    );
}

export default Seat;
