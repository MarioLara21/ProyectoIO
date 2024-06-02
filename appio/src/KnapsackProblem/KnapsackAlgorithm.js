import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const KnapsackResult = () => {
    const navigate = useNavigate();
    const itemNames = JSON.parse(localStorage.getItem('itemNames'));
    const itemValues = JSON.parse(localStorage.getItem('itemValues'));
    const itemCosts = JSON.parse(localStorage.getItem('itemCosts'));
    const itemAmounts = JSON.parse(localStorage.getItem('itemAmounts'));
    const showExtraField = JSON.parse(localStorage.getItem('showExtraField'));
    const Bcapacity = JSON.parse(localStorage.getItem('capacity'));

    const handleBack = () => {
        navigate('/');
    };

    const maxCapacity = Bcapacity;

    const calculateUnboundedKnapsack = (names, values, costs, capacity) => {
        const n = names.length;
        const dp = Array.from({ length: n }, () => Array(capacity + 1).fill(0));

        // Fill the first column (0th item)
        for (let w = 0; w <= capacity; dp[0][w] = Math.floor(w / costs[0]) * values[0], w++);

        // Fill the rest of the columns
        for (let i = 1; i < n; i++) {
            for (let w = 0; w <= capacity; w++) {
                dp[i][w] = dp[i - 1][w]; // Start with the previous item's value
                if (w >= costs[i]) {
                    dp[i][w] = Math.max(dp[i][w], dp[i][w - costs[i]] + values[i]);
                }
            }
        }

        return dp;
    };

    const calculateBoundedKnapsack = (names, values, costs, amounts, capacity) => {
        const n = names.length;
        const dp = Array.from({ length: n }, () => Array(capacity + 1).fill(0));
        const count = Array.from({ length: n }, () => Array(capacity + 1).fill(0));

        // Fill the first column (0th item)
        for (let w = 0; w <= capacity; w++) {
            let maxCopies = Math.min(Math.floor(w / costs[0]), amounts[0]);
            dp[0][w] = maxCopies * values[0];
            count[0][w] = maxCopies;
        }

        // Fill the rest of the columns
        for (let i = 1; i < n; i++) {
            for (let w = 0; w <= capacity; w++) {
                dp[i][w] = dp[i - 1][w]; // Start with the previous item's value
                count[i][w] = 0; // Default to zero copies of the current item

                let maxCopies = Math.min(Math.floor(w / costs[i]), amounts[i]);
                for (let k = 1; k <= maxCopies; k++) {
                    if (w >= k * costs[i]) {
                        let newValue = dp[i - 1][w - k * costs[i]] + k * values[i];
                        if (newValue > dp[i][w]) {
                            dp[i][w] = newValue;
                            count[i][w] = k;
                        }
                    }
                }
            }
        }

        return { dp, count };
    };

    const { dp, count } = showExtraField 
        ? calculateBoundedKnapsack(itemNames, itemValues, itemCosts, itemAmounts, maxCapacity) 
        : { dp: calculateUnboundedKnapsack(itemNames, itemValues, itemCosts, maxCapacity), count: [] };

    const getSelectedItems = (dp, count, capacity) => {
        const selectedItems = [];
        let w = capacity;
        for (let i = itemNames.length - 1; i >= 0; i--) {
            if (count[i] && count[i][w] > 0) {
                selectedItems.push({ name: itemNames[i], quantity: count[i][w] });
                w -= count[i][w] * itemCosts[i];
            }
        }
        return selectedItems;
    };

    const selectedItems = showExtraField ? getSelectedItems(dp, count, maxCapacity) : [];

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
                                <TableCell>Costo</TableCell>
                                {showExtraField && <TableCell>Cantidad</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemNames.map((itemName, index) => (
                                <TableRow key={index}>
                                    <TableCell>{itemName}</TableCell>
                                    <TableCell>{itemValues[index]}</TableCell>
                                    <TableCell>{itemCosts[index]}</TableCell>
                                    {showExtraField && itemAmounts && <TableCell>{itemAmounts[index]}</TableCell>}
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
                                    <React.Fragment key={index}>
                                        <TableCell>{itemName}</TableCell>
                                        {showExtraField && <TableCell>Copias</TableCell>}
                                    </React.Fragment>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from({ length: maxCapacity + 1 }, (_, capacity) => (
                                <TableRow key={capacity}>
                                    <TableCell>{capacity}</TableCell>
                                    {itemNames.map((_, itemIndex) => (
                                        <React.Fragment key={itemIndex}>
                                            <TableCell>{dp[itemIndex][capacity]}</TableCell>
                                            {showExtraField && <TableCell>{count[itemIndex][capacity]}</TableCell>}
                                        </React.Fragment>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {showExtraField && (
                    <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
                        <Typography variant="h6" gutterBottom>
                            Items to take:
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {selectedItems.map(({ name, quantity }, index) => (
                                <span key={index}>{name}: {quantity} </span>
                            ))}
                        </Typography>
                    </Box>
                )}
                <Button variant="contained" color="primary" style={{ margin: "10px 10px" }} onClick={handleBack}>
                    Back
                </Button>
            </Box>
            <Footer />
        </div>
    );
};

export default KnapsackResult;
