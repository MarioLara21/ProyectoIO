import React, { useState, useEffect } from 'react';
import {} from '@mui/material';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const ITEM_COUNT_KEY = 'itemCount';

const KnapsackAlgorithm = () => {
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
    
    return (
        <div>
            <Navbar />
            <h1>Knapsack Algorithm</h1>
            
            <Footer />
        </div>
    );
}

export default KnapsackAlgorithm;