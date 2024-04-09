import React from 'react';
import './App.css';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="Contenedor">
        <Tooltip title="Encuentra las rutas más cortas entre dos puntos en un grafo ponderado." arrow placement='right'>
          <Button variant="contained" color="primary">
            Rutas más cortas
          </Button>
        </Tooltip>
        <Tooltip title="Resuelve el problema de la mochila, donde se debe determinar la combinación óptima de elementos para maximizar el valor total sin exceder el peso máximo." arrow placement='right'>
          <Button variant="contained" color="primary">
            Problema de la Mochila
          </Button>
        </Tooltip>
        <Tooltip title="Encuentra la mejor manera de reemplazar equipos o elementos en un sistema, considerando diferentes criterios y restricciones." arrow placement='right'>
          <Button variant="contained" color="primary">
            Reemplazo de equipos
          </Button>
        </Tooltip>
        <Tooltip title="Crea árboles binarios de búsqueda óptimos que minimicen el tiempo de búsqueda promedio para una secuencia de claves dada." arrow placement='right'>
          <Button variant="contained" color="primary">
            Árboles binarios de búsqueda óptimos
          </Button>
        </Tooltip>
        <Tooltip title="Resuelve problemas relacionados con secuencias de eventos deportivos, como la programación de partidos en torneos o ligas." arrow placement='right'>
          <Button variant="contained" color="primary">
            Series deportivas
          </Button>
        </Tooltip>
        <Tooltip title="Realiza la multiplicación de matrices de manera eficiente." arrow placement='right'>
          <Button variant="contained" color="primary">
            Multiplicación de matrices
          </Button>
        </Tooltip>
        <Button variant="contained" color="primary">
          Salir del programa
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export default App;
