import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import {useNavigate } from 'react-router-dom';

const SportsSeries = ({ onSubmit }) => {
const navigate = useNavigate();

return (
    <div>
    <Navbar />
    <Box
        sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        }}
    >
        <Typography variant='h4' gutterBottom>
        Sports Series
        </Typography>
        <Typography variant='body1' gutterBottom>
        This is the Sports Series page.
        </Typography>
    </Box>
    <Footer />
    </div>
);
};
export default SportsSeries;