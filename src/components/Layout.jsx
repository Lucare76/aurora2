// src/components/Layout.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import MorningGreeting from './MorningGreeting';

const Layout = ({ children }) => {
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Logo */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/aurora2-8d28f.firebasestorage.app/o/logo-aurora-ghibli.jpg?alt=media&token=90126242-877e-4b4a-865e-12d2b2605ff9"
          alt="Logo Aurora 2.0 - Stile Studio Ghibli"
          style={styles.logo}
        />

        <h2 style={styles.title}>🌟 Aurora 2.0</h2>

        {/* Menu */}
        <nav>
          <ul style={styles.navList}>
            <li><Link to="/dashboard" style={styles.navLink}>📊 Dashboard</Link></li>
            <li><Link to="/resources" style={styles.navLink}>🏦 Risorse</Link></li>
            <li><Link to="/transactions" style={styles.navLink}>💰 Movimenti</Link></li>
            <li><Link to="/categories" style={styles.navLink}>🏷️ Categorie</Link></li>
            <li><Link to="/birthdays" style={styles.navLink}>🎂 Compleanni</Link></li>
            <li><Link to="/reports" style={styles.navLink}>📈 Report</Link></li>
          </ul>
        </nav>
      </div>

      {/* Contenuto principale */}
      <div style={styles.content}>
        <MorningGreeting />
        {children}
      </div>
    </div>
  );
};

// Stili
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa'
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
  },
  logo: {
    width: '180px',
    height: 'auto',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '2px solid #3498db'
  },
  title: {
    margin: '0 0 30px 0',
    fontSize: '1.4em',
    fontWeight: 'normal',
    textAlign: 'center'
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    width: '100%',
    marginTop: '20px'
  },
  navLink: {
    display: 'block',
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '10px 15px',
    borderRadius: '6px',
    transition: 'background 0.3s, transform 0.2s',
    borderLeft: '3px solid transparent'
  },
  content: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  }
};

// Aggiungi hover dinamicamente
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  styleSheet.insertRule(`
    .navLink:hover {
      background-color: #34495e;
      transform: translateX(4px);
      border-left-color: #3498db;
    }
  `, styleSheet.cssRules.length);
}

export default Layout;