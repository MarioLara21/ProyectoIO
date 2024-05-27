import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const KnapsackResult = () => {
    const navigate = useNavigate();
    const itemNames = JSON.parse(localStorage.getItem('itemNames'));
    const itemValues = JSON.parse(localStorage.getItem('itemValues'));
    const itemAmount = JSON.parse(localStorage.getItem('itemAmounts'));
    const showExtraField = JSON.parse(localStorage.getItem('showExtraField'));
    const capacity = JSON.parse(localStorage.getItem('capacity'));

    const handleBack = () => {
        navigate('/');
    };

    const maxCapacity = itemNames.length;

    const generateRows = (maxCapacity) => {
        const rows = [];
        for (let i = 0; i <= maxCapacity; i++) {
            rows.push(i);
        }
        return rows;
    };
    const calculateBackpack = (items, capacity, amounts, bounded) => {
        const n = items.length;
        const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
        const keep = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    
        if (bounded) {
            // Bounded knapsack
            for (let i = 1; i <= n; i++) {
                const [weight, value] = items[i - 1];
                const maxAmount = amounts[i - 1];
                for (let w = 0; w <= capacity; w++) {
                    dp[i][w] = dp[i - 1][w]; // without including current item
                    for (let k = 1; k <= maxAmount; k++) {
                        if (w >= k * weight) {
                            const newValue = dp[i - 1][w - k * weight] + k * value;
                            if (newValue > dp[i][w]) {
                                dp[i][w] = newValue;
                                keep[i][w] = k;
                            }
                        }
                    }
                }
            }
        } else {
            // Unbounded knapsack
            for (let i = 1; i <= n; i++) {
                const [weight, value] = items[i - 1];
                for (let w = 1; w <= capacity; w++) {
                    if (weight <= w) {
                        const newValue = dp[i][w - weight] + value;
                        if (newValue > dp[i - 1][w]) {
                            dp[i][w] = newValue;
                            keep[i][w] = keep[i][w - weight] + 1;
                        } else {
                            dp[i][w] = dp[i - 1][w];
                        }
                    } else {
                        dp[i][w] = dp[i - 1][w];
                    }
                }
            }
        }
    
        const result = [];
        let w = capacity;
        for (let i = n; i > 0; i--) {
            if (keep[i][w] > 0) {
                result.push({ itemIndex: i - 1, quantity: keep[i][w] });
                w -= keep[i][w] * items[i - 1][0];
            }
        }
    
        return { maxValue: dp[n][capacity], selectedItems: result };
    };

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
                <h1> Result Table </h1>

                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table aria-label="result table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Capacidad</TableCell>
                                {itemNames.map((itemName, index) => (
                                    <TableCell key={index}>{itemName}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {generateRows(maxCapacity).map((capacity,rowIndex) => (
                                <TableRow key={rowIndex}>
                                    <TableCell>{capacity}</TableCell>
                                    {itemValues.map((itemValue,itemIndex) => (
                                        capacity >= itemValue ? <TableCell>{itemValue}</TableCell> : <TableCell>0</TableCell>
                                    ))}
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
