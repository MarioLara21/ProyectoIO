import React, { useEffect, useState } from 'react';
import './Menu.css';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Menu = () => {
  const navigate = useNavigate();
  const [someId, setSomeId] = useState(null);

  const handleRouteClick = (id) => {
    switch (id) {
      case 1:
        navigate('/floyds-input');
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
    };
  };

  useEffect(() => {
    if (someId !== null) { // Evita ejecutar handleRouteClick si someId es null
      handleRouteClick(someId);
    }
  }, [someId]);

  return (
    <div className="App">
      <Navbar />
      <div className="Contenedor">
        <Tooltip title="Encuentra las rutas más cortas entre dos puntos en un grafo ponderado." arrow placement='right'>
          <Button variant="contained" color="primary" onClick={() => setSomeId(1)}>
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
        <Tooltip title="Opción para salir del programa." arrow placement='right'>
        <Button variant="contained" color="primary">
          Salir del programa
        </Button>
        </Tooltip>
      </div>
      <Footer />
    </div>
  );
}

export default Menu;
