import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const SportsSeriesResults = () => {
    const navigate = useNavigate();
    const games = JSON.parse(localStorage.getItem('games'));
    const homeWinProb = parseFloat(localStorage.getItem('homeWinProb'));
    const awayWinProb = parseFloat(localStorage.getItem('awayWinProb'));
    const [probabilities, setProbabilities] = useState([]);

    const calculateProbabilities = (n, ph, pr, series) => {
        const partidosParaGanar = Math.floor(n / 2) + 1;
        const probabilidades = Array.from({ length: partidosParaGanar + 2 }).map(() =>
            Array.from({ length: partidosParaGanar + 2 }).fill("")
        );

        const qh = 1 - pr;
        const qr = 1 - ph;

        for (let i = 0; i < probabilidades.length; i++) {
            for (let j = 0; j < probabilidades[i].length; j++) {
                if (i === 1 && j >= 2) {
                    probabilidades[i][j] = 1.0000;
                } else if (i >= 2 && j === 1) {
                    probabilidades[i][j] = 0.0000;
                } else if (i === 0 && j >= 1) {
                    probabilidades[i][j] = j - 1;
                } else if (i >= 1 && j === 0) {
                    probabilidades[i][j] = i - 1;
                } else if ((i === 0 && j === 0) || (i === 1 && j === 1)) {
                    probabilidades[i][j] = "♥";
                } else {
                    probabilidades[i][j] = "-";
                }
            }
        }

        let probArribaActual;
        let probAbajoActual;

        for (let i = 0; i < probabilidades.length; i++) {
            for (let j = 0; j < probabilidades[i].length; j++) {
                if (probabilidades[i][j] === "-") {
                    const partidoActual = (partidosParaGanar - (i - 1)) + (partidosParaGanar - (j - 1)) - 1;
                    if (series[partidoActual] === true) { // true for home, false for away
                        probArribaActual = ph;
                        probAbajoActual = qr;
                    } else {
                        probArribaActual = pr;
                        probAbajoActual = qh;
                    }
                    const valorArriba = i > 0 && !isNaN(probabilidades[i - 1][j]) ? parseFloat(probabilidades[i - 1][j]) : 0;
                    const valorAbajo = j > 0 && !isNaN(probabilidades[i][j - 1]) ? parseFloat(probabilidades[i][j - 1]) : 0;
                    probabilidades[i][j] = ((valorArriba * probArribaActual) + (valorAbajo * probAbajoActual)).toFixed(4);
                }
            }
        }

        setProbabilities(probabilidades);
    };

    useEffect(() => {
        const series = games.map(game => game.home); // true for home, false for away
        calculateProbabilities(games.length, homeWinProb, awayWinProb, series);
    }, [games, homeWinProb, awayWinProb]);

    return (
        <div>
            <Navbar />
            <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
                <Typography variant="h6" gutterBottom>Información de Juegos</Typography>
                <TableContainer component={Paper} sx={{ mb: 5, maxWidth: 400 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Juego</TableCell>
                                <TableCell align="center">Localización</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {games.map((game, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">{game.home ? 'Local' : 'Visita'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" gutterBottom>Tabla de Probabilidades</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {probabilities[0] && probabilities[0].map((_, index) => (
                                    <TableCell key={index} align="center">J{index + 1}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {probabilities.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                        <TableCell key={colIndex} align="center">{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Footer />
        </div>
    );
};

export default SportsSeriesResults;
