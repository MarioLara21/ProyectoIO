import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const SportsSeries = ({ onSubmit }) => {
    const navigate = useNavigate();
    const [gamesCount, setGamesCount] = useState(1);
    const [games, setGames] = useState(Array(1).fill(0)); // 0 for Local, 1 for Visit
    const [homeWinProb, setHomeWinProb] = useState('');
    const [awayWinProb, setAwayWinProb] = useState('');

    const handleGamesCountChange = (event) => {
        const count = parseInt(event.target.value, 10);
        if (count > gamesCount) {
            setGames([...games, ...Array(count - gamesCount).fill(0)]);
        } else {
            setGames(games.slice(0, count));
        }
        setGamesCount(count);
    };

    const handleGameLocationChange = (index) => {
        const newGames = [...games];
        newGames[index] = newGames[index] === 0 ? 1 : 0;
        setGames(newGames);
    };

    const handleSubmit = () => {
        const parsedGames = games.map(game => ({
            home: game === 0,
        }));
        localStorage.setItem('games', JSON.stringify(parsedGames));
        localStorage.setItem('homeWinProb', homeWinProb);
        localStorage.setItem('awayWinProb', awayWinProb);
        navigate('/sports-series');
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');

            const count = parseInt(lines[0].trim(), 10);
            const [homeProb, awayProb] = lines[1].trim().split(',').map(value => parseFloat(value.trim()));
            const newGames = lines.slice(2, count + 2).map(line => parseInt(line.trim(), 10));

            if (isNaN(count) || count <= 0 || isNaN(homeProb) || isNaN(awayProb) || newGames.some(game => isNaN(game) || (game !== 0 && game !== 1))) {
                return; // Ensure valid data
            }

            // Reset states before setting new values
            setGamesCount(count);
            setHomeWinProb(homeProb);
            setAwayWinProb(awayProb);
            setGames(newGames);
        };

        reader.readAsText(file);
    };

    return (
        <div>
            <Navbar />
            <div style={{ textAlign: "center", margin: "30px 30px" }}>
                <Typography variant="h5" gutterBottom>Ingresar cantidad de juegos</Typography>
            </div>
            <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
                <TextField
                    label="Número de juegos"
                    value={gamesCount}
                    onChange={handleGamesCountChange}
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ width: '130px', mb: 2 }}
                />
                <Grid container spacing={2} justifyContent="center" mb={2}>
                    <Grid item>
                        <TextField
                            label="Probabilidad de ganar como local"
                            value={homeWinProb}
                            onChange={(e) => setHomeWinProb(e.target.value)}
                            type="number"
                            InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
                            sx={{ width: '250px' }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Probabilidad de ganar como visita"
                            value={awayWinProb}
                            onChange={(e) => setAwayWinProb(e.target.value)}
                            type="number"
                            InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
                            sx={{ width: '250px' }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="center">
                    {games.map((game, index) => (
                        <Grid item key={index}>
                            <Typography variant="body1">Juego {index + 1}</Typography>
                            <Button
                                variant="contained"
                                color={game === 0 ? "primary" : "secondary"}
                                onClick={() => handleGameLocationChange(index)}
                                sx={{ mb: 2 }}
                            >
                                {game === 0 ? 'Local' : 'Visita'}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <Grid container spacing={2} justifyContent="center" mt={2}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Enviar
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" component="label">
                            Subir CSV
                            <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </div>
    );
};

export default SportsSeries;