import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const BSearchInput = () => {
  const [numKeys, setNumKeys] = useState(1);
  const [keys, setKeys] = useState([]);
  const [weights, setWeights] = useState([]);

  const handleNumKeysChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      return;
    }
    setNumKeys(value);
    setKeys(Array(value).fill(''));
    setWeights(Array(value).fill(''));
  };

  const handleKeyChange = (index, value) => {
    const newKeys = [...keys];
    newKeys[index] = value;
    setKeys(newKeys);
  };

  const handleWeightChange = (index, value) => {
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.trim().split('\n');

      if (lines.length !== 2) {
        console.error('Invalid file format. Expected two rows for keys and weights.');
        return;
      }

      const newKeys = lines[0].split(',').map((key) => key.trim());
      const newWeights = lines[1].split(',').map((weight) => parseFloat(weight.trim()));

      if (newKeys.length !== newWeights.length) {
        console.error('Mismatched number of keys and weights.');
        return;
      }
      
      const data = {
        keys: newKeys,
        weights: newWeights,
      };
      localStorage.setItem('bSearchData', JSON.stringify(data));
      window.location.href = '/binary-search'; // Cambiar a la vista de búsqueda binaria
    };

    reader.readAsText(file); // Leer el archivo como texto
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      keys,
      weights,
    };
    localStorage.setItem('bSearchData', JSON.stringify(data));
    window.location.href = '/binary-search'; // Cambiar a la vista de búsqueda binaria
  };

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', margin: '30px 30px' }}>
        <Typography variant="h4">Binary Search Data Collection</Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <TextField
          label="Number of Elements"
          type="number"
          value={numKeys}
          onChange={handleNumKeysChange}
          margin="normal"
          inputProps={{ min: 1}}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Key</TableCell>
                <TableCell align="center">Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keys.map((key, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <TextField
                      value={key}
                      onChange={(e) => handleKeyChange(index, e.target.value)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      value={weights[index]}
                      onChange={(e) => handleWeightChange(index, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ margin: "30px 30px" }}
        >
          Submit
        </Button>
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label htmlFor="file-input">
          <Button variant="contained" component="span" style={{ margin: "30px 30px" }}>
            Upload File
          </Button>
        </label>
      </Box>
      <Footer />
    </div>
  );
};

export default BSearchInput;