import React, { useState, useEffect } from 'react';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

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
                    <Button
                        key={index}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.is_occupied}
                        variant={isSeatSelected ? "contained" : "outlined"}
                        style={{ color: seat.is_occupied ? '#f57c00' : (isSeatSelected ? '#0288d1' : '#388e3c') }}
                    >
                        <EventSeatIcon />
                    </Button>
                );
            }
            rows.push(
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {row}
                </div>
            );
        }
        return rows;
    };

    return (
        <div>
            <div>Price: {a_price}</div>
            <div>Type: {a_type}</div>
            <div>Cinema: {a_cinema}</div>
            <div style={{ marginTop: '10px' }}>
                <h4>Seat Grid</h4>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {renderSeatGrid()}
                </div>
            </div>
            <Button onClick={handleSelectAllClick}>Select All</Button>
            <Button onClick={handleUnselectAllClick}>Unselect All</Button>

            <Box>
                <Button
                    variant="outlined"  
                    component={Link} 
                    to={`/details/${movie_id}/${a_id}${selectedSeats.length > 0 ? `/${JSON.stringify(selectedSeats)}` : ''}`}
                    style={{ width: '100%', marginTop: '30px' }}
                >
                    Proceed to Reservation
                </Button>
            </Box>
        </div>
        
    );
};

export default AiringTimeDetails;
