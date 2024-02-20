import React, { useEffect, useState } from 'react';
import { Box, TableCell, TableContainer, Table, TableHead, TableRow, Paper, TableBody, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styled from '@emotion/styled';



export default function Reservation() {
    const [reserve, setReserve] = useState([]);
    const [reservationIdFilter, setReservationIdFilter] = useState('');
    const [isCancelledFilter, setIsCancelledFilter] = useState('active');
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

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


    // handle filter
    const filteredReserve = reserve.filter(item => {
        return (
            item.res_id.includes(reservationIdFilter) &&
            (isCancelledFilter === 'all' || (isCancelledFilter === 'active' && !item.isCancel) || (isCancelledFilter === 'cancelled' && item.isCancel))
        );
    });

    // handle cancel toggle
    const handleCancelToggle = (reservationId) => {
        setSelectedReservationId(reservationId);
        setOpenDialog(true);
    };

    // cancel reject
    const handleCancelReject = () => {
        setOpenDialog(false);
    };

    // cancel reservation
    const handleCancelConfirm = async () => {
        // REQUEST TO UPDTAE THE RESERVATION INTO CANCEL STATUS
        const updatedReserve = reserve.map(async (item) => {
            if (item.res_id === selectedReservationId) {
                const dataRes = { isCancel: true }
                const response = await fetch(`http://localhost:5555/api/reserve/${item._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataRes)
                });
                // MAP ALL THE RESERVE SEATS AND UPDATE 
                try {
                    const formData = { is_occupied: true };
                    console.log(item.a_id);
                    for (const seat of item.seat) {
                        const response = await fetch(`http://localhost:5555/api/reserve/cancel/${item.a_id}/${seat}`, {
                            
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        });
                        if (!response.ok) {
                            throw new Error('Failed to submit data');
                        }
                    }
                } catch (error) {
                    console.error('Error submitting data:', error);
                }
            }
            return item;
        });
        await Promise.all(updatedReserve);
        setOpenDialog(false);
        window.location.reload(); // Reload the page after the updates
    };

    // request
    useEffect(() => {
        const fetchReserve = async () => {
            try {
                const response = await fetch('http://localhost:5555/api/details');
                if (!response.ok) {
                    throw new Error('Failed to fetch reservations');
                }
                const data = await response.json();
                setReserve(data);
                console.log(reserve);
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchReserve();
    }, []);
    

    
    return (
        
        <Box className='reserv' style={{padding: '50px'}}>
        <Paper style={{padding: '20px'}}>
            <Box style={{display:"flex", width:"100%", justifyContent:"space-between"}}>
              <Box style={{padding: "20px 10px" }}>
                <TextField
                style={{width: "100%"}}
                    label="Reservation ID"
                    value={reservationIdFilter}
                    onChange={(e) => setReservationIdFilter(e.target.value)}
                    
                />
              </Box>
              <Box style={{width:"20%", padding: "20px 10px"}}>
                <FormControl style={{width:"100%"}}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={isCancelledFilter}
                      onChange={(e) => setIsCancelledFilter(e.target.value)}
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                        <MenuItem value="all">All</MenuItem>
                    </Select>
                  </FormControl>
              </Box>
                
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Reservation ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Senior</TableCell>
                            <TableCell>Seats</TableCell>
                            <TableCell>Amount Paid</TableCell>
                            <TableCell>Cancelled</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                        {/* DISPLAY WITH FILTER  */}
                        {filteredReserve.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>{row.res_id}</TableCell>
                                <TableCell>{`${row.f_name} ${row.m_name} ${row.l_name}`}</TableCell>
                                <TableCell>{row.senior}</TableCell>
                                <TableCell>{row.seat.join(', ')}</TableCell>
                                <TableCell>PHP {row.amt_pay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell>{row.isCancel ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    {!row.isCancel ? 
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            onClick={() => handleCancelToggle(row.res_id)}
                                        >
                                            Cancel
                                        </Button>
                                        :
                                        null
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        <Dialog open={openDialog}>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogContent>
                <Box>
                    <Typography>
                        Are you sure you want to cancel this reservation?
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelConfirm} color="error">Yes</Button>
                <Button onClick={handleCancelReject} color="primary">No</Button>
            </DialogActions>
        </Dialog>
    </Box>
    )
}
