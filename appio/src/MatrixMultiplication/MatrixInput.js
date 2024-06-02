import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import {useNavigate } from 'react-router-dom';

const MatrixInput = ({ onSubmit }) => {
const navigate = useNavigate();
const [matrixCount, setMatrixCount] = useState(1);
const [dimensions, setDimensions] = useState([{ rows: '', cols: '' }]);

const handleMatrixCountChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setMatrixCount(count);
    setDimensions(Array(count).fill({ rows: '', cols: '' }));
};

const handleChange = (index, type, value) => {
    const newDimensions = [...dimensions];
    newDimensions[index] = { ...newDimensions[index], [type]: value };
    setDimensions(newDimensions);
};

const handleSubmit = () => {
    const parsedDimensions = dimensions.map(dim => ({
    rows: parseInt(dim.rows, 10),
    cols: parseInt(dim.cols, 10),
    })).filter(dim => !isNaN(dim.rows) && !isNaN(dim.cols));
    localStorage.setItem('matrixDimensions', JSON.stringify(parsedDimensions));
    navigate('/matrix-multiplication');
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
    const text = reader.result;
    const lines = text.split('\n').filter(line => line.trim() !== '');

    const count = parseInt(lines[0].trim(), 10);
      if (isNaN(count) || count <= 0) return; // Ensure the first line is a valid number

    const newDimensions = lines.slice(1, count + 1).map(line => {
        const [rows, cols] = line.split(',').map(value => value.trim());
        return { rows: parseInt(rows, 10), cols: parseInt(cols, 10) };
    });

      if (newDimensions.some(dim => isNaN(dim.rows) || isNaN(dim.cols))) return; // Ensure all dimensions are valid numbers

    setMatrixCount(count);
    setDimensions(newDimensions);
    };

    reader.readAsText(file);
};

return (
    <div>
    <Navbar />
    <div style={{ textAlign: "center", margin: "30px 30px" }}>
        <Typography variant="h5" gutterBottom>Ingresar Dimensiones de las Matrices</Typography>
    </div>
    <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
        <TextField
        label="Número de Matrices"
        value={matrixCount}
        onChange={handleMatrixCountChange}
        type="number"
        InputProps={{ inputProps: { min: 1 } }} 
        sx={{ width: '130px', mb: 2 }}
        />
    </Box>
    <Box display="flex" flexDirection="column" alignItems="center">
        {dimensions.map((dim, index) => (
        <Box key={index} display="flex" justifyContent="space-around" width="100%" mb={2}>
            <TextField
            label={`Filas de la Matriz ${index + 1}`}
            type="number"
            value={dim.rows}
            onChange={(e) => handleChange(index, 'rows', e.target.value)}
            margin="normal"
            sx={{ width: '45%' }}
            />
            <TextField
            label={`Columnas de la Matriz ${index + 1}`}
            type="number"
            value={dim.cols}
            onChange={(e) => handleChange(index, 'cols', e.target.value)}
            margin="normal"
            sx={{ width: '45%' }}
            />
        </Box>
        ))}
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mx: 1 }}>Calcular Multiplicación Óptima</Button>
        <Button
            variant="contained"
            component="label"
            sx={{ mx: 1 }}
        >
            Subir CSV
            <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileUpload}
            />
        </Button>
        </Box>
        <Footer />
    </div>
    );
};

export default MatrixInput;
