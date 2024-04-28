import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const BSearch = () => {
  const [keys, setKeys] = useState([]);
  const [weights, setWeights] = useState([]);
  const [costTable, setCostTable] = useState([]);
  const [rootTable, setRootTable] = useState([]); // Nueva tabla para raíces
  const [iteration, setIteration] = useState(0);
  const [currentHighlights, setCurrentHighlights] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('bSearchData'));
    if (storedData) {
      setKeys(storedData.keys);
      storedData.weights = storedData.weights.map((w) => parseFloat(w));
      setWeights(storedData.weights);
    }
  }, []);

  useEffect(() => {
    if (keys.length > 0 && weights.length > 0) {
      initTables(); // Inicializar ambas tablas
    }
  }, [keys, weights]);

  const initTables = () => {
    const n = keys.length;
    const initialCostTable = Array.from({ length: n + 1 }, () => Array(n).fill(0));
    const initialRootTable = Array.from({ length: n + 1 }, () => Array(n).fill(null)); // Tabla para raíces
    const probabilities = weights.map((w) => w / weights.reduce((a, b) => a + b, 0));

    for (let i = 0; i < n; i++) {
      initialCostTable[i][i] = probabilities[i];
      initialRootTable[i][i] = i; // Cada elemento es su propia raíz al principio
    }

    setCostTable(initialCostTable);
    setRootTable(initialRootTable); // Configurar tabla de raíces
  };

  const nextIteration = () => {
    const n = keys.length;
    const updatedCostTable = [...costTable]; // Copiar tabla de costos
    const updatedRootTable = [...rootTable]; // Copiar tabla de raíces
    const diagonal = iteration + 1;
    const newHighlights = [];

    if (diagonal < n) {
      for (let i = 0; i < n - diagonal; i++) {
        const j = i + diagonal;
        updatedCostTable[i][j] = Number.MAX_SAFE_INTEGER;

        for (let r = i; r <= j; r++) {
          let cost = (r > i ? updatedCostTable[i][r - 1] : 0) + (r < j ? updatedCostTable[r + 1][j] : 0);
          cost += weights.slice(i, j + 1).reduce((sum, w) => sum + w, 0);
          if (cost < updatedCostTable[i][j]) {
            updatedCostTable[i][j] = cost;
            updatedRootTable[i][j] = r; // Guardar el índice de la raíz seleccionada
          }
          newHighlights.push({ row: i, col: j }); // Agregar casillas a resaltar
        }
      }

      setCostTable(updatedCostTable); // Actualizar tabla de costos
      setRootTable(updatedRootTable); // Actualizar tabla de raíces
      setCurrentHighlights(newHighlights); // Resaltar casillas relevantes
      setIteration(diagonal); // Avanzar a la siguiente iteración
    }
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ textAlign: 'center', margin: '30px 30px' }}>
        <Typography variant="h4">Binary Search Data Collection</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Keys</TableCell>
                {keys.map((key, index) => (
                  <TableCell key={index}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {costTable.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>{keys[rowIndex] || 'N/A'}</TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      sx={{
                        backgroundColor:
                          currentHighlights.some(
                            (highlight) => highlight.row === rowIndex && highlight.col === cellIndex
                          )
                            ? 'yellow' // Resaltar
                            : 'transparent', // Normal
                      }}
                    >
                      {cell.toFixed(4)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper} sx={{ marginTop: '30px' }}>
          <div style={{ textAlign: 'center', margin: '30px 30px' }}>
            <Typography variant="h6">Tabla R</Typography>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Keys</TableCell>
                {keys.map((key, index) => (
                  <TableCell key={index}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rootTable.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>{keys[rowIndex] || 'N/A'}</TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      sx={{
                        backgroundColor:
                          currentHighlights.some(
                            (highlight) => highlight.row === rowIndex && highlight.col === cellIndex
                          )
                            ? 'yellow' // Resaltar
                            : 'transparent', // Normal
                      }}
                    >
                      {cell !== null ? keys[cell] : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box style={{ textAlign: 'center', margin: '30px 30px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={nextIteration}
            disabled={iteration >= keys.length - 1}
            style={{ margin: '30px 30px' }}
          >
            Next Iteration
          </Button>
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default BSearch;
