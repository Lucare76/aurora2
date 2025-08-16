// src/components/Layout.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Logo Aurora 2.0 in stile Studio Ghibli */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/aurora2-8d28f.firebasestorage.app/o/logo-aurora-ghibli.jpg?alt=media&token=90126242-877e-4b4a-865e-12d2b2605ff9"
          alt="Logo Aurora 2.0 - Stile Studio Ghibli"
          style={{
            width: '180px',
            height: 'auto',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '2px solid #3498db'
          }}
        />

        <h2 style={{ 
          marginBottom: '30px', 
          textAlign: 'center', 
          fontWeight: 'normal',
          fontSize: '1.4em'
        }}>
          🌟 Aurora 2.0
        </h2>

        {/* Menu di navigazione */}
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/dashboard" style={linkStyle}>
                📊 Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/resources" style={linkStyle}>
                🏦 Risorse
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/transactions" style={linkStyle}>
                💰 Movimenti
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/categories" style={linkStyle}>
                🏷️ Categorie
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/birthdays" style={linkStyle}>
                🎂 Compleanni
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/reports" style={linkStyle}>
                📈 Report
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Contenuto della pagina */}
      <div style={{ 
        flex: 1, 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh' 
      }}>
        {children}
      </div>
    </div>
  );
};

// Stile per i link del menu
const linkStyle = {
  color: 'white', 
  textDecoration: 'none', 
  fontSize: '16px',
  display: 'block',
  padding: '8px 12px',
  borderRadius: '4px',
  transition: 'background 0.3s',
  borderLeft: '3px solid transparent'
};

export default Layout;