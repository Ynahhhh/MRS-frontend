import React, { useEffect, useState } from 'react';
import { Box, Divider, MenuItem, Select, Typography } from '@mui/material';
import styled from '@emotion/styled';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { Link } from 'react-router-dom'
import AiringTimeDetails from './AiringTimeDetails';

const SeatBox = styled(Box)({
    display:'flex',
    justifyContent:'space-between'
});

const MoreDetails = styled(Typography)({
    display: 'flex',
    marginTop: '5px',
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
        // You can perform any necessary actions with the selected seats here
        console.log('Selected seats:', seats);
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
            <Box className="movie-details" style={{width: "25%", alignItems:"center", textAlign: "center" }}>
                
                <Box className="movie-image" style={{ width: '100%' }}>
                    <Box className="movie-image" >
                        <img src="" alt="" style={{ width: '300px', height: '400px' }} />                           
                    </Box>
                </Box>
                    <Typography variant='h5'><b>{movie.m_title}</b></Typography>
                    <Divider style={{background:'#0D99FF', marginTop: '10px' }}/>
                    <Typography variant='body2' style={{marginTop:'10px' }}>{movie.m_desc}</Typography>
                    <MoreDetails variant='subtitle1'><b>MPA FILM RATING: </b> {movie.m_mpa}</MoreDetails>
                    <MoreDetails variant='subtitle1'><b>DURATION: </b> {movie.m_hrs} hrs</MoreDetails>
            </Box>
            <Box className="chair-details" style={{width: "40%" }}>
                This is chair details
                {selectedTime && (
                            <p> {`Selected Time: ${formatTime(selectedTime.a_starttime)} - ${formatTime(selectedTime.a_endtime)}`}</p>

                        )}
                <AiringTimeDetails selectedTime={selectedTime} onSelectedSeatsChange={handleSelectedSeatsChange} />

            </Box>
            <Box className="seat-tab" style={{width: "20%" }}>
                {/* SELECT DATE */}
                <Select
        value={selectedDate}
        onChange={handleChange}
        displayEmpty
        fullWidth
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
                <Box>
                <div>
    <h2>Airing Times for {selectedDate}</h2>
    {Array.isArray(airingTimes) && airingTimes.map((time) => {
        const startTime = new Date(time.a_starttime);
        const isDisabled = startTime <= new Date(); // Check if start time is past or present
        return (
            <button
                key={time.a_id}
                value={time.a_id}
                onClick={() => handleTimeSelection(time)}
                disabled={isDisabled} // Disable the button if start time is past or present
                style={{ backgroundColor: isDisabled ? 'gray' : 'blue' }} // Change color based on disabled state
            >
                {`${time.a_type} : ${formatTime(time.a_starttime)} - ${formatTime(time.a_endtime)}`}
            </button>
        );
    })}
</div>
                </Box>
            </Box>
        </SeatBox>
    );
}

export default Seat;
