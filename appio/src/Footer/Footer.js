import React from 'react';
import './Footer.css';
// import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <div className='footer-link-wrapper'>
        <div className='footer-links'>
          <div className='footer-link-items'>
            <a href='#'>Grupo Dinamita</a>
          </div>
        </div>
        <div className='footer-links'>
          <div className='footer-link-items'>
            <p className='p-bold'>Desarrolladores</p>
            <p className='p-italic'>
              Kevin Nuñez Cruz
            </p>
            <p className='p-italic'>
              Mario Lara
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;