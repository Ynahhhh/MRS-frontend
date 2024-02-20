import React, { useState, useEffect } from 'react';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

const MoreDetails = styled(Box)({
    display: 'flex',
    marginTop: '5px',
    justifyContent: 'space-between'
});

const AiringTimeDetails = ({ selectedTime, onSelectedSeatsChange }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    console.log(selectedSeats);

    useEffect(() => {
        onSelectedSeatsChange(selectedSeats);
    }, [selectedSeats, selectedTime, onSelectedSeatsChange]);

    if (!selectedTime) return null;

    const { a_price, a_type, a_cinema, a_seat, a_id, movie_id } = selectedTime;

    const handleSeatClick = (seat) => {
        setSelectedSeats(prevSelectedSeats => {
            if (prevSelectedSeats.includes(seat.position)) {
                return prevSelectedSeats.filter(s => s !== seat.position);
            } else {
                return [...prevSelectedSeats, seat.position];
            }
        });
    };

    const handleSelectAllClick = () => {
        const remainingSeats = a_seat.filter(seat => !seat.is_occupied && !selectedSeats.includes(seat.position));
        const remainingSeatPositions = remainingSeats.map(seat => seat.position);
        setSelectedSeats(prevSelectedSeats => [...prevSelectedSeats, ...remainingSeatPositions]);
    };

    const handleUnselectAllClick = () => {
        setSelectedSeats([]);
    };

    const renderSeatGrid = () => {
        const rows = [];
        for (let i = 0; i < 8; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
                const index = i * 5 + j;
                const seat = a_seat[index];
                const isSeatSelected = selectedSeats.includes(seat.position);
                row.push(
                    <Box>
                        <Button
                        key={index}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.is_occupied}
                        variant="contained"
                        style={{
                            backgroundColor: seat.is_occupied ? '#f57c00' : (isSeatSelected ? '#0288d1' : '#388e3c'), padding:"-2px", color:'#fff' }}
                    >
                        {seat.position}
                       
                    </Button>
                    </Box>
                    
                );
            }
            rows.push(
                <Box key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom:'10px' }}>
                    {row}
                </Box>
            );
        }
        return rows;
    };

    return (
        <Box >
            <Box style={{display:"flex", justifyContent:"space-between"}}>
                <Typography variant='h6' style={{paddingLeft:'10px',marginBottom: '10px' }}><b>SEAT LAYOUT</b></Typography>
                <Box>
                    {selectedSeats.length === 0 ? (
                        <Button onClick={handleSelectAllClick}>Select All</Button>
                    ) : (
                        <Button onClick={handleUnselectAllClick}>Unselect All</Button>
                    )}
                </Box>
            </Box>
            
            <Box style={{ marginTop: '10px' , alignItems:"center", textAlign:"center", padding: "0px 50px"}}>
                <Box mb={1}><Typography variant="caption">SCREEN</Typography></Box>
                <Typography  style={{ display: 'flex', flexDirection: 'column' }}>
                    
                    {renderSeatGrid()}
                </Typography>
                <Box style={{display: 'flex', justifyContent: 'space-between', marginTop: "2px"}}>
                    <Box><Typography variant="caption">EXIT</Typography></Box> 
                    <Box><Typography variant="caption">ENTRANCE</Typography></Box>
                </Box>
            </Box>
                
            <Box style={{ maginTop: '30px'}}>
                <Box style={{display:"flex", justifyContent:"space-between", padding: '0 20px'}}>
                    
                    <MoreDetails> 
                        <Typography  variant='h6'><b>PRICE: </b></Typography>
                        <Typography  variant='h6'> {a_price}</Typography>
                    </MoreDetails>
                    <MoreDetails> 
                        <Typography variant='h6' ><b>TYPE: </b></Typography>
                        <Typography  variant='h6'> {a_type.toUpperCase()}</Typography>
                    </MoreDetails>
                    <MoreDetails> 
                        <Typography variant='h6'><b>CINEMA: </b></Typography>
                        <Typography variant='h6'> {a_cinema}</Typography>
                    </MoreDetails>
                </Box>
                
                    

            </Box>
            <Box>
            {selectedSeats.length > 0 && (
                <Button
                    variant="outlined"  
                    component={Link} 
                    to={`/details/${movie_id}/${a_id}${selectedSeats.length > 0 ? `/${JSON.stringify(selectedSeats)}` : ''}`}
                    style={{ width: '100%', marginTop: '30px' }}
                >
                    Proceed to Reservation
                </Button>
            )}
            </Box>
        </Box>
    );
};

export default AiringTimeDetails;
