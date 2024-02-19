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
                        variant={isSeatSelected ? "contained" : "outlined"}
                        style={{ color: seat.is_occupied ? '#f57c00' : (isSeatSelected ? '#fff' : '#000'), padding:"-2px" }}
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
                <Typography style={{ display: 'flex', flexDirection: 'column' }}>
                    
                    {renderSeatGrid()}
                </Typography>
            </Box>
                
            <Box style={{display:"flex", justifyContent:"space-between", maginTop: '30px'}}>
                <Box style={{width:'50%', padding: '0 20px'}}>
                    <Typography><b>MORE DETAILS</b></Typography>
                    <MoreDetails> 
                        <Typography variant='caption'><b>PRICE: </b></Typography>
                        <Typography variant='caption'> {a_price}</Typography>
                    </MoreDetails>
                    <MoreDetails> 
                        <Typography variant='caption'><b>TYPE: </b></Typography>
                        <Typography variant='caption'> {a_type.toUpperCase()}</Typography>
                    </MoreDetails>
                    <MoreDetails> 
                        <Typography variant='caption'><b>CINEMA: </b></Typography>
                        <Typography variant='caption'> {a_cinema}</Typography>
                    </MoreDetails>
                </Box>
                <Box style={{width:'50%', padding: '0 20px'}}>
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
