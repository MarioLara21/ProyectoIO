import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand">Grupo Dinamita</span>
      </div>
      <div className="navbar-right">
        <div className="dropdown">
          <button className="dropbtn">Algoritmos</button>
          <div className="dropdown-content">
            <a href="#">Rutas más cortas</a>
            <a href="#">Problema de la Mochila</a>
            <a href="#">Reemplazo de equipos</a>
            <a href="#">Árboles binarios de búsqueda óptimos</a>
            <a href="#">Series deportivas</a>
            <a href="#">Multiplicación de matrices</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
