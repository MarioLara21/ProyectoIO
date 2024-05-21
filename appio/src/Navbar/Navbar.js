import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      <a href="/" className="navbar-brand">Grupo Dinamita</a>
      </div>
      <div className="navbar-right">
        <div className="dropdown">
          <button className="dropbtn">Algoritmos</button>
          <div className="dropdown-content">
            <a href="/floyds-input">Rutas más cortas</a>
            <a href="/knapsack-problem">Problema de la Mochila</a>
            <a href="/equipment-input">Reemplazo de equipos</a>
            <a href="/binary-search-input">Árboles binarios de búsqueda óptimos</a>
            <a href="#">Series deportivas</a>
            <a href="#">Multiplicación de matrices</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
