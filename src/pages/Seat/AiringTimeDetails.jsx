import React, { useState, useEffect } from 'react';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

const MoreDetails = styled(Box)({
    display: 'flex',
    marginTop: '5px',
    justifyContent: 'space-between'
});

const AiringTimeDetails = ({ selectedTime, onSelectedSeatsChange }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        onSelectedSeatsChange(selectedSeats);
    }, [selectedSeats, selectedTime, onSelectedSeatsChange]);

    if (!selectedTime) return null;

    const { a_price, a_type, a_cinema, a_seat } = selectedTime;

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
                        variant={isSeatSelected ? "contained" : "outlined"}
                        style={{ color: seat.is_occupied ? '#f57c00' : (isSeatSelected ? '#0288d1' : '#388e3c'), padding:"-2px" }}
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
            <Box style={{marginTop: '10px', marginLeft: '500px'}}>
            {selectedSeats.length === 0 ? (
                <Button onClick={handleSelectAllClick}>Select All</Button>
            ) : (
                <Button onClick={handleUnselectAllClick}>Unselect All</Button>
            )}
            </Box>
            <Box style={{ marginTop: '10px' , alignItems:"center", textAlign:"center", padding: "0px 50px"}}>
                <Typography style={{ display: 'flex', flexDirection: 'column' }}>
                    
                    {renderSeatGrid()}
                </Typography>
            </Box>
                
            <Box style={{display:"flex", justifyContent:"space-between" ,padding: "10px 40px"}}>
                    <MoreDetails> 
                        <Typography><b>PRICE: </b></Typography>
                        <Typography> {a_price}</Typography>
                    </MoreDetails>
                    <MoreDetails> 
                        <Typography><b>TYPE: </b></Typography>
                        <Typography> {a_type}</Typography>
                    </MoreDetails>
                    <MoreDetails> 
                        <Typography><b>CINEMA: </b></Typography>
                        <Typography> {a_cinema}</Typography>
                    </MoreDetails>

            </Box>
            
            
        </Box>
       
    );
};

export default AiringTimeDetails;
