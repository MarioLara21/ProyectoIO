import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const MatrixChainMultiplication = () => {
    const dimensions = JSON.parse(localStorage.getItem('matrixDimensions')) || [];

    if (dimensions.length === 0) {
        return <Typography variant="h5" gutterBottom>No se encontraron dimensiones de matriz en el almacenamiento local.</Typography>;
    }

    // Validar que las matrices sean multiplicables
    for (let i = 0; i < dimensions.length - 1; i++) {
        if (dimensions[i].cols !== dimensions[i + 1].rows) {
            return (
                <div>
                    <Navbar />
                    <Box>
                        <Typography variant="h5" gutterBottom>Error de Dimensiones</Typography>
                        <Typography variant="body1" gutterBottom>
                            Las dimensiones ingresadas no son válidas para la multiplicación de matrices. 
                            Las columnas de la matriz {i + 1} deben coincidir con las filas de la matriz {i + 2}.
                        </Typography>
                    </Box>
                    <Footer />
                </div>
            );
        }
    }

    const p = [dimensions[0].rows, ...dimensions.map(dim => dim.cols)];
    const n = p.length - 1;
    const m = Array.from({ length: n }, () => Array(n).fill(0));
    const s = Array.from({ length: n }, () => Array(n).fill(0));
    const procedures = Array.from({ length: n }, () => Array(n).fill(''));

    for (let l = 2; l <= n; l++) {
        for (let i = 0; i < n - l + 1; i++) {
            let j = i + l - 1;
            m[i][j] = Infinity;
            for (let k = i; k < j; k++) {
                let q = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
                if (q < m[i][j]) {
                    m[i][j] = q;
                    s[i][j] = k;
                    procedures[i][j] = `Multiplica A${i + 1} (${p[i]}x${p[k + 1]}) y A${j + 1} (${p[k + 1]}x${p[j + 1]})\nCosto: ${q}`;
                }
            }
        }
    }

    const printOptimalParens = (s, i, j) => {
        if (i === j) {
            return `A${i + 1}`;
        } else {
            return `(${printOptimalParens(s, i, s[i][j])}${printOptimalParens(s, s[i][j] + 1, j)})`;
        }
    };

    return (
        <div>
            <Navbar />
            <Box>
                <Typography variant="h5" gutterBottom>Dimensiones de las Matrices</Typography>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Matriz</TableCell>
                                <TableCell>Filas</TableCell>
                                <TableCell>Columnas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dimensions.map((dim, index) => (
                                <TableRow key={index}>
                                    <TableCell>{`A${index + 1}`}</TableCell>
                                    <TableCell>{dim.rows}</TableCell>
                                    <TableCell>{dim.cols}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h5" gutterBottom>Procedimiento de la Matriz de Costos</Typography>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {Array.from({ length: n }, (_, i) => (
                                    <TableCell key={i}>{`A${i + 1}`}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {procedures.map((row, i) => (
                                <TableRow key={i}>
                                    {row.map((cell, j) => (
                                        <TableCell key={j}>{i <= j ? cell : ''}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h5" gutterBottom>Paréntesis Óptimos</Typography>
                <Typography variant="body1"><pre>{printOptimalParens(s, 0, n - 1)}</pre></Typography>
            </Box>
            <Footer />
        </div>
    );
};

export default MatrixChainMultiplication;