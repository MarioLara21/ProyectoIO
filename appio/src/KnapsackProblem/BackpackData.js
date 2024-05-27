import React, { useState, useEffect } from 'react';
import {Box, Button, TextField, Typography, Grid} from '@mui/material';
import {useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const ITEM_COUNT_KEY = 'itemCount';

const BackpackData = () => { 
    const navigate = useNavigate();
    const [capacity, setCapacity] = useState(0);
    const [amount, setAmount] = useState(0);
    const [items, setItems] = useState(() => {
        const storedItems = localStorage.getItem(ITEM_COUNT_KEY);
        return storedItems ? parseInt(storedItems) : 5;
    });
    const [itemNames, setItemNames] = useState(Array.from({ length: items }, (_, index) => `Item ${index + 1}`));
    const [itemValues, setItemValues] = useState(Array.from({ length: items }, (_, index) => `Value ${index + 1}`));
    const [itemAmount, setItemAmount] = useState(Array.from({ length: items }, (_, index) => `Amount ${index + 1}`));
    const [showExtraField, setShowExtraField] = useState(false); // State for extra TextField visibility
    useEffect(() => {
        localStorage.clear();
        const storedData = localStorage.getItem('backpackData');
        if (storedData) {
            if(showExtraField == false){
            const { items, capacity } = JSON.parse(storedData);
            }else{
                const { items, capacity,amount } = JSON.parse(storedData);
                setAmount(amount);
            }
            setItems(items);
            setCapacity(capacity);
        }
    }, []);
    const calculateBackpack = (items, capacity, amounts, bounded) => {
        const n = items.length;
        const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

        if (bounded) {
            // Bounded knapsack
            for (let i = 1; i <= n; i++) {
                const [weight, value] = items[i - 1];
                const maxAmount = amounts[i - 1];
                for (let w = 0; w <= capacity; w++) {
                    dp[i][w] = dp[i - 1][w]; // without including current item
                    for (let k = 1; k <= maxAmount; k++) {
                        if (w >= k * weight) {
                            dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - k * weight] + k * value);
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
                        dp[i][w] = Math.max(dp[i - 1][w], dp[i][w - weight] + value);
                    } else {
                        dp[i][w] = dp[i - 1][w];
                    }
                }
            }
        }
        return dp[n][capacity];
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result;
            const lines = text.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
            const itemNames = [];
            const itemValues = [];
            const itemAmounts = [];
            let capacity = 0;
            let bounded = false;

            // Process CSV lines
            lines.forEach((line, index) => {
                const values = line.split(',').map(value => value.trim());
                if (index === 0) {
                    // First line is the capacity
                    capacity = parseInt(values[0], 10);
                } else {
                    // Subsequent lines are items
                    const name = values[0];
                    const value = parseInt(values[1], 10);
                    itemNames.push(name);
                    itemValues.push(value);

                    if (values.length > 2) {
                        const amount = parseInt(values[2], 10);
                        itemAmounts.push(amount);
                        bounded = true;
                    } else {
                        itemAmounts.push(1); // Default amount for unbounded
                    }
                }
            });

            const itemsCount = itemNames.length;

            // Save to localStorage and update state
            const data = { itemNames, itemValues, itemAmounts, capacity, bounded };
            localStorage.setItem('backpackData', JSON.stringify(data));

            setCapacity(capacity);
            setItems(itemsCount);
            setItemNames(itemNames);
            setItemValues(itemValues);
            setItemAmount(itemAmounts);
            setShowExtraField(bounded); // Set the visibility of the extra field based on bounded status
        };

        reader.readAsText(file);
    };

    const handleItemChange = (event) => {
        const newItems = parseInt(event.target.value);
        if (newItems >= 1) {
            setItems(newItems);
            setItemValues(Array.from({ length: newItems }, (_, index) => itemValues[index] || `Value ${index + 1}`));
            setItemNames(Array.from({ length: newItems }, (_, index) => itemNames[index] || `Item ${index + 1}`));
            setItemAmount(Array.from({ length: newItems }, (_, index) => itemAmount[index] || `Amount ${index + 1}`));
        }
    };
    const handleBackpackChange = (event) => {
        const newCapacity = parseInt(event.target.value);
        if (newCapacity >= 0) {
            setCapacity(newCapacity);
        }
    };
    const handleItemNameChange = (index, name) => {
        const updatedItemNames = [...itemNames];
        updatedItemNames[index] = name;
        setItemNames(updatedItemNames);
    };
    const handleItemValueChange = (index, value) => {
        const updatedItemValues = [...itemValues];
        updatedItemValues[index] = value;
        setItemValues(updatedItemValues);
    };
    const handleItemAmountChange = (index, amount) => {
        const updatedItemAmount = [...itemAmount];
        updatedItemAmount[index] = amount;
        setItemAmount(updatedItemAmount);
    };
    const handleSubmit = () => {
        localStorage.setItem(ITEM_COUNT_KEY, items.toString());
        localStorage.setItem('itemNames', JSON.stringify(itemNames));
        localStorage.setItem('itemValues', JSON.stringify(itemValues));
        localStorage.setItem('itemAmounts', JSON.stringify(itemAmount));
        localStorage.setItem('showExtraField', JSON.stringify(showExtraField));
    
        const formattedItems = itemNames.map((_, i) => [
            itemNames[i],
            parseInt(itemValues[i], 10)
        ]);
        const formattedAmounts = itemAmount.map(amount => parseInt(amount, 10));
    
        const result = calculateBackpack(
            formattedItems,
            capacity,
            showExtraField ? formattedAmounts : [],
            showExtraField
        );
    
        localStorage.setItem('knapsackResult', JSON.stringify(result));
        navigate('/knapsack-algorithm');
    };

    const toggleExtraField = () => {
        setShowExtraField(!showExtraField);
    };
    return (
        <div>
            <Navbar />
            <div style={{ textAlign: "center", margin: "30px 30px" }}>
            <Typography variant="h4">Knapsack Algorithm</Typography>
            </div>
            <Box display="-ms-grid" flexDirection="column" justifyContent="center" alignItems="center" mb={15}> 
            <TextField 
            label="Number of Items"
            value={items}
            onChange={handleItemChange}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ width: '130px' }}
            />
            <TextField 
            label="Backpack Capacity"
            value={capacity}
            onChange={handleBackpackChange}
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            sx={{ width: '130px' }}
            />
            <Button onClick={toggleExtraField} variant="contained" sx={{ marginTop: 2 }}>
                    {showExtraField ? 'Bounded Problem' : 'Unbounded Problem'}
                </Button>
            <Grid container spacing={1} columns={3}>
                <Grid item xs={16}>
            {itemNames.map((itemName, index) => (
                <TextField
                key={index}
                label={`Item ${index + 1}`}
                value={itemName}
                onChange={(e) => handleItemNameChange(index, e.target.value)}
                style={{ margin: "5px 5px" }}
                type = "text"
            />
            ))}
            </Grid>
            </Grid>
            <Grid item xs={16}>
            {itemValues.map((itemValue, index) => (
                <TextField
                key={index}
                label={`Value ${index + 1}`}
                value={itemValue}
                onChange={(e) => handleItemValueChange(index, e.target.value)}
                style={{ margin: "5px 5px" }}
            />
            ))}
            </Grid>
            {showExtraField && (
                <Grid item xs={16}>
                    {itemAmount.map((itemAmount, index) => (
                        <TextField
                        key={index}
                        label={`Amount ${index + 1}`}
                        value={itemAmount}
                        onChange={(e) => handleItemAmountChange(index, e.target.amount)}
                        style={{ margin: "5px 5px" }}
                    />
                    ))}
                </Grid>
            )}
            <Button variant="contained" color="primary" style={{ margin: "10px 10px" }} onClick={handleSubmit}>
            Submit
            </Button>
            <input
            type="file"
            id="file-input"
            style={{ display: 'none' }} // Ocultar la entrada de archivo
            onChange={handleFileUpload}
            />
            <label htmlFor="file-input">
            <Button variant="contained" component="span"> {/* Botón MUI */}
                Upload File
            </Button>
        </label>
            </Box>
            <Footer />
        </div>
    ); 
    };

export default BackpackData;