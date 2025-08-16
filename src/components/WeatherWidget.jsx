// src/components/WeatherWidget.jsx

import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
  const [city, setCity] = useState('Barano d\'Ischia');
  const [weather, setWeather] = useState(null);

  // 🌍 Coordinate fisse per luoghi precisi
  const locations = {
    'barano': { name: 'Barano d\'Ischia', lat: 40.7350, lon: 13.9780 },
    'barano d\'ischia': { name: 'Barano d\'Ischia', lat: 40.7350, lon: 13.9780 },
    'ischia': { name: 'Ischia', lat: 40.7347, lon: 14.0092 },
    'roma': { name: 'Roma', lat: 41.9028, lon: 12.4964 },
    'napoli': { name: 'Napoli', lat: 40.8518, lon: 14.2681 },
    'milano': { name: 'Milano', lat: 45.4642, lon: 9.1900 },
    'firenze': { name: 'Firenze', lat: 43.7696, lon: 11.2558 }
  };

  // 🌤️ Simula il meteo in base alla città e al tempo
  const simulateWeather = (cityName) => {
    const now = new Date();
    const hour = now.getHours();
    const temp = Math.floor(Math.random() * 10 + 20); // 20-30°C
    let condition, icon, message;

    // 🔁 Cambia condizione in base all'ora
    if (hour < 6) {
      condition = 'Clear Night';
      icon = '🌙';
      message = 'La notte è calma. Le stelle vegliano sul tuo tesoro.';
    } else if (hour < 12) {
      condition = 'Sunny';
      icon = '☀️';
      message = 'Il sole sorride. Una giornata perfetta per sognare.';
    } else if (hour < 18) {
      condition = Math.random() > 0.7 ? 'Cloudy' : 'Sunny';
      icon = Math.random() > 0.7 ? '⛅' : '☀️';
      message = 
        icon === '⛅' 
          ? 'Nuvole passeggere. Il vento racconta storie antiche.' 
          : 'Il sole brilla. Tutto è al suo posto.';
    } else {
      condition = 'Partly Cloudy';
      icon = '🌆';
      message = 'Il tramonto accarezza l’orizzonte. La giornata si chiude in pace.';
    }

    return {
      temp,
      condition,
      icon,
      message
    };
  };

  useEffect(() => {
    const normalized = city.trim().toLowerCase();
    const location = locations[normalized] || locations['barano'];

    // Simula il meteo ogni volta
    const simulated = simulateWeather(location.name);
    setWeather({
      location: location.name,
      current: simulated
    });
  }, [city]);

  return (
    <div style={styles.widget}>
      <h3 style={styles.title}>🌤️ Il tempo a {weather?.location || 'Barano d\'Ischia'}</h3>

      <div style={styles.inputGroup}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Inserisci una città (es. Ischia, Barano)"
          style={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
        />
      </div>

      {weather && (
        <>
          <div style={styles.info}>
            <div style={styles.temp}>{weather.current.temp}°C</div>
            <div style={styles.icon}>{weather.current.icon}</div>
            <div>{weather.current.condition}</div>
          </div>
          <p style={styles.message}>{weather.current.message}</p>
        </>
      )}
    </div>
  );
};

const styles = {
  widget: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    color: '#333'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '10px'
  },
  temp: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333'
  },
  icon: {
    fontSize: '32px'
  },
  message: {
    margin: '10px 0 0 0',
    fontSize: '14px',
    color: '#555',
    fontStyle: 'italic'
  }
};

export default WeatherWidget;