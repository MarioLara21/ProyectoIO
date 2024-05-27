import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const KnapsackResult = () => {
    const navigate = useNavigate();
    const result = JSON.parse(localStorage.getItem('knapsackResult'));
    const itemNames = JSON.parse(localStorage.getItem('itemNames'));
    const itemValues = JSON.parse(localStorage.getItem('itemValues'));
    const itemAmount = JSON.parse(localStorage.getItem('itemAmount'));
    const showExtraField = JSON.parse(localStorage.getItem('showExtraField'));

    const handleBack = () => {
        navigate('/');
    };

    const columns = [
        { id: 'item', label: 'Item', minWidth: 100 },
        { id: 'weight', label: 'Weight', minWidth: 100 },
        { id: 'value', label: 'Value', minWidth: 100 },
    ];

    const rows = JSON.parse(localStorage.getItem('knapsackResult'));
    return (
        <div>
            <Navbar />
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mb={15}>
                <Typography variant="h4" gutterBottom>
                    Knapsack Result
                </Typography>
                <h1> Item Table </h1>
                <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Objeto</TableCell>
                                <TableCell>Valor</TableCell>
                                {showExtraField && <TableCell>Cantidad</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemNames.map((itemName, index) => (
                                <TableRow key={index}>
                                    <TableCell>{itemName}</TableCell>
                                    <TableCell>{itemValues[index]}</TableCell>
                                    {showExtraField && itemAmount && <TableCell>{itemAmount[index]}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                        Items to take:
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        {itemNames.map((row, index) => (
                            <span key={index}>{row} </span>
                        ))}
                    </Typography>
                </Box>
                <Button variant="contained" color="primary" style={{ margin: "10px 10px" }} onClick={handleBack}>
                    Back
                </Button>
            </Box>
            <Footer />
        </div>
    );
};

export default KnapsackResult;
