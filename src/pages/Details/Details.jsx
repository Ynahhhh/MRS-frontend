import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Backdrop, Box, Button, Grid, IconButton, Modal, Paper, 
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
    const [openModal, setOpenModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [seniorCount, setSeniorCount] = useState(0);
    const [movieDetails, setMovieDetails] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [airingTime, setAiringTime] = useState(null);

    // Get the dynamic part of the URL
    const movieId = window.location.pathname.split('/')[2];
    const airingId = window.location.pathname.split('/')[3];
    let decodedSelectedSeats = JSON.parse(decodeURIComponent(window.location.pathname.split('/')[4]));
    console.log(movieId);

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
            isCancel: false,
            m_id: movieId
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
            // Proceed to success modal
            setOpenModal(true);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
        setPaymentConfirmed(true);
        setOpenModal(false); // Close the payment modal
        
    };
    const handlePaymentSuccessModalClose = () => {
        const formData = {
            is_occupied: true
        };
        try {
            decodedSelectedSeats.map(async (seat) => {
                const response = await fetch(`http://localhost:5555/api/movies/${movieId}/${seat}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
        
                if (!response.ok) {
                    throw new Error('Failed to submit data');
                }
            });
        } catch (error) {
            console.error('Error submitting data:', error);
        }

        // Reset form fields
        setFirstName('');
        setMiddleName('');
        setLastName('');
        decodedSelectedSeats=[];
        setMovieDetails(null);
        //setTotalPrice(0);
        //setSelectedSeats([]);
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
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5555/api/movies/${movieId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch movie details');
                }
                const data = await response.json();
                // // Extracting the date part
                // if (data && data.m_date) {
                //     data.m_date = data.m_date.substring(0, 10); // or data.m_date.split('T')[0];
                // }
                // // Extracting the time part from m_starttime
                // if (data && data.m_starttime) {
                //     data.m_starttime = data.m_starttime.substring(11, 16); // or data.m_starttime.split('T')[1].substring(0, 5);
                // }

                // // Extracting the time part from m_endtime
                // if (data && data.m_endtime) {
                //     data.m_endtime = data.m_endtime.substring(11, 16); // or data.m_endtime.split('T')[1].substring(0, 5);
                // }
                // // Calculate duration in hours and minutes
                // const startTime = new Date(`2000-01-01T${data.m_starttime}:00`);
                // const endTime = new Date(`2000-01-01T${data.m_endtime}:00`);
                // const durationMinutes = Math.round((endTime - startTime) / (1000 * 60)); // Time difference in minutes

                // const hours = Math.floor(durationMinutes / 60);
                // const minutes = durationMinutes % 60;

                // data.duration = { hours, minutes };

                setMovieDetails(data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    useEffect(() => {
        const fetchAiringTimeDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5555/api/airing/${airingId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch airing time details');
                }
                const airingTimeData = await response.json();
                // Here, you can update your component state with the fetched airing time details
                setAiringTime(airingTimeData);
            } catch (error) {
                console.error('Error fetching airing time details:', error);
            }
        };
    
        fetchAiringTimeDetails();
    }, [airingId]);

    useEffect(() => {
        const fetchSeatDetails = async () => {
            try {
                // Ensure movieId exists before fetching seat details
                if (!airingId) {
                    return;
                }
    
                const response = await fetch(`http://localhost:5555/api/airing/${airingId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch seat details');
                }
                const seatData = await response.json();
                console.log(seatData);
    
            } catch (error) {
                console.error('Error fetching seat details:', error);
            }
        };
    
        if (airingId && airingTime) {
            fetchSeatDetails();
        }
    }, [airingId, airingTime, seniorCount]);
 
    useEffect(() => {
        const calculateTotalPrice = () => {
            if (airingTime && decodedSelectedSeats) {
                const seatCount = decodedSelectedSeats.length;
                let totalPrice = 0;
    
                if (airingTime.a_type === 'regular') {
                    //.toUpperCase()
                    const price = (seniorCount > 0) ? (airingTime.a_price * 0.8 * seniorCount) : airingTime.a_price;
                    const basePrice = (seatCount - seniorCount) * airingTime.a_price;
                    if(seniorCount > 0)
                        totalPrice = price + basePrice;
                    else totalPrice = seatCount * airingTime.a_price;
                } else if (airingTime.a_type === 'premiere') {
                    //.toUpperCase()
                    totalPrice = seatCount * airingTime.a_price;
                }
                setTotalPrice(totalPrice);
            }
        };
        calculateTotalPrice();
    }, [seniorCount, airingTime, decodedSelectedSeats]);

    function getCurrentDateTime() {
        // Create a new Date object with the current time and date
        const currentDate = new Date();
    
        // Get the current date
        const year = currentDate.getFullYear(); // Full year (e.g., 2024)
        const month = currentDate.getMonth() + 1; // Month (0-11), adding 1 to make it 1-12
        const day = currentDate.getDate(); // Day of the month (1-31)
    
        // Get the current time
        const hours = currentDate.getHours(); // Hour (0-23)
        const minutes = currentDate.getMinutes(); // Minutes (0-59)
        const seconds = currentDate.getSeconds(); // Seconds (0-59)
    
        // Construct a string representation of the current date and time
        const currentDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
    
        return currentDateTime;
    }
    
    // Call the function to get the current date and time
    const currentDateTime = getCurrentDateTime();
    // console.log("Current Date and Time:", currentDateTime);
    const MAX_ROWS_BEFORE_SCROLL = 5; // Maximum number of rows before enabling scroll
    const regular = (decodedSelectedSeats.length - seniorCount) * (movieDetails ? movieDetails.m_price : 0);
    // const discount = (movieDetails && movieDetails.m_type.toUpperCase() === 'REGULAR' && seniorCount > 0) ? (movieDetails.m_price * 0.8 * seniorCount) : 0;

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > *': {
                width: 'calc(50% - 16px)',
                margin: '8px',
                },
            }}
        >
            <Box sx={{ bgcolor: 'grey.300', height: 352 }} > 
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" ml={1} fontWeight='bold' sx={{ marginRight: 1 }}>RESERVATION DESCRIPTION</Typography>
                    <Typography mt={0.5} ml={18} mr={1} sx={{ fontSize: 15 }}>RESERVATION ID: {currentDateTime}</Typography>
                </Box>
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
                        id="fname" 
                        label="First Name" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        size="small" 
                    />
                    <TextField
                        id="mname" 
                        label="Middle Name" 
                        variant="outlined"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        size="small"
                    />
                    <TextField 
                        id="lname" 
                        label="Last Name" 
                        variant="outlined" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        size="small"
                    />
                </Box>
                <Box display="flex" alignItems="center" mt={2} mb={3} width={200} height={20} justifyContent="space-between">
                    {!movieDetails || movieDetails.m_type !== 'premiere' ? (
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
                    {!movieDetails || movieDetails.m_type !== 'premiere' ? (
                        <IconButton onClick={handleIncrement}>
                            <AddIcon />
                        </IconButton>
                    ) : null}
                </Box>
                {movieDetails && airingTime && (
                        <Box>
                            <Box>
                                <Typography  variant="h7">MOVIE DESCRIPTION</Typography>
                            </Box>
                            <Grid container spacing={2} ml={2} mt={0.02}>
                                <Grid item xs={4}>
                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Movie Title: {movieDetails.m_title}</Typography>
                                </Grid>
                                <Grid item xs={4}></Grid>
                                <Grid item xs={4}>
                                      <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Type: {airingTime.a_type}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Date: {movieDetails.m_date}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Start Time: {airingTime.a_starttime}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>End Time: {airingTime.a_endtime}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Duration: {movieDetails.m_hrs} hrs</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>Price: PHP {airingTime.a_price}</Typography>
                                </Grid>
                                <Grid item xs={4}></Grid>
                                <Grid item xs={4}>
                                    <Typography sx={{ fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'left' }}>MPA FILM RATING: {movieDetails.m_mpa}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
            </Box>

            <Box sx={{ bgcolor: 'grey.300', height: 352 }} > 
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography  variant="h6" ml={1} fontWeight='bold'>SEAT RESERVED</Typography>
                    <Typography mt={0.5} ml={30} mr={1}>Total Number of Seats Reserved: {decodedSelectedSeats.length}</Typography>
                </Box>
                <Box sx={{ alignItems: 'center', justifyContent: 'center', marginTop: '10px', marginLeft: '15px' }}>
                    <TableContainer component={Paper} sx={{ width: '98%', maxHeight: MAX_ROWS_BEFORE_SCROLL * 40 + 20, overflowY: 'auto'  }}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead sx={{ backgroundColor: '#BBE2EC', position: 'sticky', top: 0, zIndex: 1000 }}>
                                <TableRow>
                                    <TableCell align='center'><Typography fontWeight='bold' fontSize='small'>SEAT</Typography></TableCell>
                                    <TableCell align="center"><Typography fontWeight='bold' fontSize='small'>PRICE</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ backgroundColor: '#f0f0f0' }}>
                                {decodedSelectedSeats.map((seat, index) => (
                                    <TableRow key={index}>
                                        <TableCell align='center'>{seat}</TableCell>
                                        <TableCell align='center'> PHP </TableCell>
                                        {/* {movieDetails ? movieDetails.m_price.toFixed(2) : '-'} */}
                                        {/* <TableCell>{seat}</TableCell> */}
                                        {/* Display more properties of the seat if available*/ }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ marginTop: '20px', marginLeft: '542px'}}>
                    <Button
                        as={Link}
                        to={`/movies/${movieId}`}
                        variant="contained" 
                        onClick={handleUpdateSeats}
                        sx={{
                            width:'150px',
                            top:'160px',
                            left:'230px',
                            textDecoration:'none'
                        }}
                    >
                        Update Seats
                    </Button> 
                </Box>
            </Box>

            <Box sx={{ bgcolor: 'grey.300', height: 300 }} > 
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography  variant="h6" ml={1} fontWeight='bold'>PAYMENT BREAKDOWN</Typography>
                </Box>
                {/* {movieDetails && ( */}
                    <Box sx={{ marginLeft: '13px', marginTop: '10px' }}>
                        <TableContainer component={Paper} sx={{ width: '98%' }}>
                            <Table size="small" aria-label="a dense table">
                                <TableBody sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableRow>
                                        <TableCell align='left'><Typography fontWeight='bold' fontSize='small'>Type: </Typography></TableCell>
                                        <TableCell align="right"></TableCell>
                                        {/* {movieDetails ? movieDetails.m_type.toUpperCase() : '-'} */}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='left'><Typography fontWeight='bold' fontSize='small'>Number of Seats: </Typography></TableCell>
                                        <TableCell align="right">{decodedSelectedSeats.length}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='left'><Typography fontWeight='bold' fontSize='small'>Discounted Seats: [{seniorCount}]</Typography></TableCell>
                                        <TableCell align="right">PHP </TableCell> 
                                        {/* {discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
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
                {/* )} */}
                <Stack spacing={10} direction="row" marginTop={6} marginLeft={59.5}>
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
                    onClose={handleCloseModal}
                    BackdropComponent={GrayBackdrop}
                    BackdropProps={{ onClick: handleBackdropClick }}
                >
                    <Box
                        sx={{
                        width: '400px', // Adjust the width as needed
                        backgroundColor: 'white', // Optional: Change the background color
                        borderRadius: '10px', // Optional: Add border radius
                        padding: '10px', // Optional: Add padding
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // Center the content horizontally
                        }}
                    >
                        <img src={confirmPaymentIcon} alt="Confirm Payment Icon" style={{ width: '150px', height: '150px' }} />
                        <Typography variant="h6" sx={{ mt: "5px", mb: "15px", fontWeight: 'bold' }}>CONFIRM PAYMENT</Typography>
                        <Box>
                            <Typography>Name: {firstName} {middleName} {lastName}</Typography>
                            <Typography>Reservation ID: {currentDateTime}</Typography>
                            <Typography>Amount to Pay:   PHP {totalPrice.toFixed(2)}</Typography>
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
                                onClick={(e) => handleConfirmPayment(e)}
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
                
                <StyledModal>
                    <Modal 
                        open={paymentConfirmed} 
                        onClose={handlePaymentSuccessModalClose} 
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
                            <img src={successPaymentIcon} alt="Success Payment Icon" style={{ width: '150px', height: '150px' }} />
                            <Typography variant="h6" sx={{ mt: "5px", mb: "15px", fontWeight: 'bold' }}>PAYMENT SUCCESSFUL</Typography>
                            <Typography>Your payment has been successfully processed.</Typography>
                            <Typography>Please check your email for your reservation details.</Typography>
                            <Button 
                                as={Link}
                                to="/"
                                variant='contained'
                                onClick={handlePaymentSuccessModalClose} 
                                className='doneBtn'
                                sx={{
                                    width:'100px',
                                    marginTop: '15px',
                                    marginBottom: '50px',
                                    borderRadius: '5px',
                                    textDecoration:'none'
                                }}
                            >
                                Done
                            </Button>
                        </Box>
                    </Modal>
                </StyledModal>  
            </Box>
        </Box>
    )
}