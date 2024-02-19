import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Backdrop, Box, Button, Divider, Grid, IconButton, Modal, Paper, 
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, TextField, Typography, styled } from '@mui/material';
import confirmPaymentIcon from '../../assets/secure-payment.png';
import successPaymentIcon from '../../assets/verified.png';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const GrayBackdrop = styled(Backdrop)`
  background-color: rgba(0, 0, 0, 0.2);
`;

export default function Details() {

    // *******************************
    // these are fetching data under specific airing and movie
    const [airing, setAiring] = useState(null);
    const [movie, setMovie] = useState(null);

    // console.log(airing);
    // console.log(movie);
    // Check if airing is not null before accessing its _id property
    if (airing && airing._id) {
        console.log("shit", airing._id);
    } else {
        console.log('Airing is null or _id is not available');
    }


    // ******************************
    const [openModal, setOpenModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [seniorCount, setSeniorCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Get the dynamic part of the URL
    const movieId = window.location.pathname.split('/')[2];
    const airingId = window.location.pathname.split('/')[3];
    let decodedSelectedSeats = JSON.parse(decodeURIComponent(window.location.pathname.split('/')[4]));

    const handleCloseModal = () => {
        setOpenModal(false);
    }; 
    const handleOpenModal = (e) => {
        e.preventDefault()
        if (firstName.trim() === '' || middleName.trim() === '' || lastName.trim() === '') {
            alert(`Please enter customer's complete name.`);
            return;
        }
        setOpenModal(true);
    };
    const handleConfirmPayment = async (e) => {
        e.preventDefault();
        const formData = {
            f_name: firstName,
            m_name: middleName,
            l_name: lastName,
            senior: seniorCount,
            res_id: currentDateTime,
            seat: decodedSelectedSeats,
            amt_pay: totalPrice,
            is_cancel: false,
            m_id: movie._id,
            a_id: airing._id
        };
    
        try {
            const response = await fetch('http://localhost:5555/api/details/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
        setOpenModal(false);
        setPaymentConfirmed(true);
    };
    const handlePaymentSuccessModalClose = async () => {
        const seatOccupancy = {
            is_occupied: true // Set is_occupied to true to indicate the seat is already occupied
        };
    
        try {
            // Iterate over each position in decodedSelectedSeats array
            for (const position of decodedSelectedSeats) {
                // Send a PATCH request to update the position with is_occupied: false
                const response = await fetch(`http://localhost:5555/api/details/${airing._id}/${position}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(seatOccupancy)
                });
    
                if (!response.ok) {
                    throw new Error('Failed to update seat occupancy');
                }
            }
        } catch (error) {
            console.error('Error updating seat occupancy:', error);
        }
    
        // Reset form fields and state variables
        setFirstName('');
        setMiddleName('');
        setLastName('');
        decodedSelectedSeats = [];
        setPaymentConfirmed(false);
    };
    

    const handleUpdateSeats = () => {
        emptySelectedSeats();
    };
    const handleBackdropClick = (event) => {
        event.stopPropagation();    // Prevent closing the modal if the backdrop is clicked
    };
    const emptySelectedSeats = () => {
        decodedSelectedSeats = [];     // Empty selected seats by resetting the state variable to an empty array
    };
    const handleIncrement = () => {
        if (seniorCount < decodedSelectedSeats.length)
            setSeniorCount(prevCount => prevCount + 1);
    };
    const handleDecrement = () => {
        if (seniorCount > 0) {
            setSeniorCount(prevCount => prevCount - 1);
        }
    };
 
    useEffect(() => {
        const calculateTotalPrice = () => {
            if (airing && decodedSelectedSeats) {
                const seatCount = decodedSelectedSeats.length;
                let totalPrice = 0;
    
                if (airing.a_type.toUpperCase() === 'REGULAR') {
                    const price = (seniorCount > 0) ? (airing.a_price * 0.8 * seniorCount) : airing.a_price;
                    const basePrice = (seatCount - seniorCount) * airing.a_price;
                    if(seniorCount > 0)
                        totalPrice = price + basePrice;
                    else totalPrice = seatCount * airing.a_price;
                } else if (airing.a_type.toUpperCase() === 'PREMIERE') {
                    totalPrice = seatCount * airing.a_price;
                }
                setTotalPrice(totalPrice);
            }
        };
        calculateTotalPrice();
    }, [seniorCount, airing, decodedSelectedSeats]);


    // *******************************************
    // get airing
    useEffect(() => {
        fetchAiringById(airingId);
    }, [airingId]);

    // FETCH MOVIE DETAILS OF MOVIE M_ID
    const fetchAiringById = async (airingId) => {
        try {
            const response = await fetch(`http://localhost:5555/api/details/time/${airingId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movie');
            }
            const data = await response.json();
            // Extracting the date part
                if (data && data.a_date) {
                    data.a_date = data.a_date.substring(0, 10); // or data.m_date.split('T')[0];
                }
                // Extracting the time part from m_starttime
                if (data && data.a_starttime) {
                    data.a_starttime = data.a_starttime.substring(11, 16); // or data.m_starttime.split('T')[1].substring(0, 5);
                }

                // Extracting the time part from m_endtime
                if (data && data.a_endtime) {
                    data.a_endtime = data.a_endtime.substring(11, 16); // or data.m_endtime.split('T')[1].substring(0, 5);
                }
                // Calculate duration in hours and minutes
                const startTime = new Date(`2000-01-01T${data.a_starttime}:00`);
                const endTime = new Date(`2000-01-01T${data.a_endtime}:00`);
                const durationMinutes = Math.round((endTime - startTime) / (1000 * 60)); // Time difference in minutes

                const hours = Math.floor(durationMinutes / 60);
                const minutes = durationMinutes % 60;
                const id = data._id;

                data.duration = { hours, minutes };
            setAiring(data);
            console.log(id)
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    };


    // get movie

    useEffect(() => {
        fetchMovieById(movieId); 
    }, [movieId]);

    // FETCH MOVIE DETAILS OF MOVIE M_ID
    const fetchMovieById = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:5555/api/movies/${movieId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movie');
            }
            const data = await response.json();
            
            setMovie(data);
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    };
        
    // *******************************************

    function getCurrentDateTime() {
        // Create a new Date object with the current time and date
        const currentDate = new Date();
    
        // Get the current date
        const year = currentDate.getFullYear(); // Full year (e.g., 2024)
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month with leading zeros (01-12)
        const day = currentDate.getDate(); // Day of the month (1-31)
    
        // Get the current time
        const hours = currentDate.getHours(); // Hour (0-23)
        const minutes = currentDate.getMinutes(); // Minutes (0-59)
        const seconds = currentDate.getSeconds(); // Seconds (0-59)
    
        // Construct a string representation of the current date and time
        const currentDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
    
        return currentDateTime;
    }
    const currentDateTime = getCurrentDateTime();
    const MAX_ROWS_BEFORE_SCROLL = 5; // Maximum number of rows before enabling scroll
    const regular = (decodedSelectedSeats.length - seniorCount) * (airing ? airing.a_price : 0);
    const discount = (airing && airing.a_type.toUpperCase() === 'REGULAR' && seniorCount > 0) ? (airing.a_price * 0.8 * seniorCount) : 0;

    return (
        <Box padding="20px">
            <Grid container spacing={2}>
                {/* First column */}
                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        {/* First row */}
                        <Grid item xs={12}>
                            <Box sx={{ bgcolor: '#EEF5FF', height: '375px', boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.25)', padding: '10px' }} > 
                                <Box textAlign="left" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6" ml={1} fontWeight='bold'>RESERVATION DESCRIPTION</Typography>
                                    <Typography mt={0.5} ml={18} mr={1} sx={{ fontSize: '15px' }}>RESERVATION ID: {currentDateTime}</Typography>
                                </Box>
                                <Divider sx={{ bgcolor: '#40A2E3', mt: 0.3, mb: 0.5, height: '2.5px' }} />
                                <Box>
                                    <Typography ml={1} variant="h7">CUSTOMER DESCRIPTION</Typography>
                                </Box>
                                <Box
                                    component="form"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        '& > :not(style)': { m: 1, width: '23ch'},
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        label="First Name" 
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        size="small" 
                                    />
                                    <TextField
                                        label="Middle Name" 
                                        variant="outlined"
                                        value={middleName}
                                        onChange={(e) => setMiddleName(e.target.value)}
                                        size="small"
                                    />
                                    <TextField 
                                        label="Last Name" 
                                        variant="outlined" 
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        size="small"
                                    />
                                </Box>
                                <Box display="flex" alignItems="center" mt={2} mb={3} width={200} height={20} justifyContent="space-between">
                                    {!airing || airing.a_type !== 'premiere' ? (
                                        <IconButton onClick={handleDecrement}>
                                            <RemoveIcon />
                                        </IconButton>
                                    ) : null}
                                    <TextField
                                        value={seniorCount}
                                        variant="outlined"
                                        label="Senior Citizens"
                                        size="small"
                                        inputProps={{ readOnly: true, style: { textAlign: 'center', height: '15px' } }}
                                        sx={{ width: '120px', textAlign: 'center', '& .MuiInputBase-input': { height: '40px' }, marginLeft: '10px' }}
                                    />
                                    {!airing || airing.a_type !== 'premiere' ? (
                                        <IconButton onClick={handleIncrement}>
                                            <AddIcon />
                                        </IconButton>
                                    ) : null}
                                </Box>
                                {movie && airing && (
                                    <Box>
                                        <Box>
                                            <Typography ml={1} variant="h7">MOVIE DESCRIPTION</Typography>
                                        </Box>
                                        <Box alignContent="center">
                                            <Grid container spacing={2} ml={2} mt={0.02}>
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Movie Title: {movie.m_title}</Typography>
                                                </Grid>
                                                <Grid item xs={4}></Grid>
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Type: {airing.a_type.toUpperCase()}</Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Date: {airing.a_date}</Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Start Time: {airing.a_starttime}</Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>End Time: {airing.a_endtime}</Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Duration: {movie.m_hrs} hrs</Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Price: PHP {airing.a_price.toFixed(2)}</Typography>
                                                </Grid>
                                                <Grid item xs={4}></Grid>
                                                <Grid item xs={4}>
                                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>MPA FILM RATING: {movie.m_mpa}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                        {/* Second row */}
                        <Grid item xs={12}>
                            <Box sx={{ bgcolor: '#EEF5FF', height: '293px', boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.25)', padding: '10px' }} > 
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography  variant="h6" ml={1} fontWeight='bold'>PAYMENT BREAKDOWN</Typography>
                                </Box>
                                <Divider sx={{ bgcolor: '#40A2E3', mt: 0.3, mb: 0.5, height: '2.5px' }} />
                                <Box sx={{ marginLeft: '13px', marginTop: '10px' }}>
                                    <TableContainer component={Paper} sx={{ width: '98%' }}>
                                        <Table size="small" aria-label="a dense table">
                                            <TableBody sx={{ backgroundColor: '#EEF5FF' }}>
                                                <TableRow>
                                                    <TableCell align='left'><Typography fontWeight='bold' fontSize='small'>Type: </Typography></TableCell>
                                                    <TableCell align="right"></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align='left'><Typography fontWeight='bold' fontSize='small'>Number of Seats: </Typography></TableCell>
                                                    <TableCell align="right">{decodedSelectedSeats.length}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align='left'><Typography fontWeight='bold' fontSize='small'>Discounted Seats: [{seniorCount}]</Typography></TableCell>
                                                    <TableCell align="right">PHP {discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align='left'><Typography fontWeight='bold' fontSize='small'>Regular Seats: [{decodedSelectedSeats.length - seniorCount}]</Typography></TableCell>
                                                    <TableCell align="right">PHP {regular.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    <TableCell align='right'><Typography fontWeight='bold' fontSize='small'>TOTAL AMOUNT TO PAY: PHP {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                                <Stack spacing={10} direction="row" marginTop={2.5} marginLeft={59.5}>
                                    <Button 
                                        variant="contained" 
                                        onClick={handleOpenModal}
                                        sx={{
                                            width:'205px',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        Proceed to Payment
                                    </Button>   
                                </Stack>
                                {/* Payment modal */}
                                <StyledModal
                                    open={openModal}
                                    // onClose={handleCloseModal}
                                    BackdropComponent={GrayBackdrop}
                                    BackdropProps={{ onClick: handleBackdropClick }}
                                >
                                    <Box
                                        sx={{
                                        width: '400px', 
                                        backgroundColor: 'white', 
                                        borderRadius: '10px', 
                                        padding: '10px', 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', 
                                        }}
                                    >
                                        <img src={confirmPaymentIcon} alt="Confirm Payment Icon" style={{ width: '150px', height: '150px' }} />
                                        <Typography variant="h6" sx={{ mt: "5px", mb: "15px", fontWeight: 'bold' }}>CONFIRM PAYMENT</Typography>
                                        <Box>
                                            <Typography>Name: {firstName} {middleName} {lastName}</Typography>
                                            <Typography>Reservation ID: {currentDateTime}</Typography>
                                            <Typography>Amount to Pay:   PHP {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                        </Box>
                                        <Stack spacing={5} direction="row" marginTop={5} justifyContent="center">
                                            <Button 
                                                variant='contained' 
                                                onClick={handleCloseModal} 
                                                sx={{
                                                    width:'100px',
                                                    borderRadius: '5px',
                                                    backgroundColor: 'gray',
                                                    '&:hover': {
                                                        backgroundColor: 'gray',
                                                    },
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                variant='contained' 
                                                onClick={handleConfirmPayment}
                                                sx={{
                                                    width:'100px',
                                                    borderRadius: '5px'
                                                }}
                                            >
                                                Confirm
                                            </Button>
                                        </Stack>
                                    </Box>
                                </StyledModal>
                                
                                <StyledModal
                                        open={paymentConfirmed} 
                                        // onClose={handlePaymentSuccessModalClose} 
                                        BackdropComponent={GrayBackdrop} 
                                        BackdropProps={{ onClick: handleBackdropClick }}
                                >
                                    <Box 
                                        sx={{
                                        width: '450px', 
                                        backgroundColor: 'white', 
                                        borderRadius: '10px', 
                                        padding: '10px', 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', 
                                        }}
                                    >
                                        <img src={successPaymentIcon} alt="Success Payment Icon" style={{ width: '150px', height: '150px', alignItems: 'center', justifyContent: 'center' }} />   
                                        <Typography variant="h6" sx={{ mt: "15px", mb: "15px", fontWeight: 'bold' }}>PAYMENT SUCCESSFUL</Typography>
                                        <Typography>Your payment has been successfully processed.</Typography>
                                        <Typography>Please check your email for your reservation details.</Typography>
                                        <Button 
                                            as={Link}
                                            to={`/movies/${movieId}`}
                                            variant='contained'
                                            onClick={handlePaymentSuccessModalClose}
                                            sx={{
                                                width:'100px',
                                                marginTop: '25px',
                                                //marginBottom: '50px',
                                                borderRadius: '5px',
                                                textDecoration:'none',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Done
                                        </Button>
                                    </Box>
                                </StyledModal>  
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Second column */}
                <Grid item xs={6} height='100vh'>
                    <Box sx={{ bgcolor: '#EEF5FF', height: '682.5px', boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.25)', padding: '10px' }} > 
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography  variant="h6" ml={1} fontWeight='bold'>SEAT RESERVED</Typography>
                            <Typography mt={0.5} ml={31.5} mr={1}>Total Number of Seats Reserved: {decodedSelectedSeats.length}</Typography>
                        </Box>
                        <Divider sx={{ bgcolor: '#40A2E3', mt: 0.3, mb: 0.5, height: '2.5px' }} />
                        <Box sx={{ alignItems: 'center', justifyContent: 'center', marginTop: '15px', marginLeft: '15px' }}>
                            <TableContainer component={Paper} sx={{ width: '98%', maxHeight: MAX_ROWS_BEFORE_SCROLL * 102 + 20, overflowY: 'auto'  }}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead sx={{ backgroundColor: '#BBE2EC', position: 'sticky', top: 0, zIndex: 1000 }}>
                                        <TableRow>
                                            <TableCell align='center'><Typography fontWeight='bold' fontSize='small'>SEAT</Typography></TableCell>
                                            <TableCell align="center"><Typography fontWeight='bold' fontSize='small'>PRICE</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ backgroundColor: '#EEF5FF' }}>
                                        {decodedSelectedSeats.map((seat, index) => (
                                            <TableRow key={index}>
                                                <TableCell align='center'>{seat}</TableCell>
                                                <TableCell align='center'> PHP {airing ? airing.a_price.toFixed(2) : '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        <Stack spacing={10} direction="row" marginTop={6} marginLeft={67.5}>
                            <Button 
                                as={Link}
                                to={`/movies/${movieId}`}
                                variant="contained" 
                                onClick={handleUpdateSeats}
                                sx={{
                                    width:'150px',
                                    borderRadius: '5px',
                                    textDecoration: 'none'
                                }}
                            >
                                Update Seats
                            </Button>   
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}