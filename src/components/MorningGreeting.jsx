// src/components/MorningGreeting.jsx

import React, { useState, useEffect } from 'react';

const MorningGreeting = () => {
  const [show, setShow] = useState(false);

  // 🌸 7 messaggi poetici (uno per ogni giorno della settimana)
  const messages = [
    "Buongiorno! Oggi il vento soffia piano, come una carezza. Totoro ti saluta con un sorriso.",
    "Il sole ha appena baciato le foglie. Anche tu sei prezioso come questo momento. Buongiorno.",
    "Totoro si è svegliato con te. Anche lui ha sentito il canto degli uccellini. Oggi sarà una bella giornata!",
    "Le fate del bosco hanno acceso le lanterne. Il mondo è pronto per te. Buon inizio!",
    "Hai dormito bene? Totoro ha vegliato su di te. Oggi va tutto bene.",
    "Il cielo è limpido: anche il tuo cuore lo sarà. Buongiorno, amico del bosco.",
    "Oggi il vento soffia forte… ma il tuo tesoro è al sicuro. Totoro lo protegge."
  ];

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const today = now.toISOString().split('T')[0]; // yyyy-mm-dd

    // 🕐 Mostra solo tra le 6:00 e le 10:00
    if (hour >= 6 && hour < 10) {
      const greetedToday = localStorage.getItem('totoroGreeted') === today;
      if (!greetedToday) {
        setShow(true);
        // Salva che è stato salutato oggi
        localStorage.setItem('totoroGreeted', today);
      }
    }
  }, []);

  const closeGreeting = () => {
    setShow(false);
  };

  if (!show) return null;

  // 🌞 Calcola l'indice del messaggio in base al giorno (cambia ogni giorno)
  const todayIndex = new Date().getDay(); // 0 = Domenica, 1 = Lunedì...
  const message = messages[todayIndex];

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <button onClick={closeGreeting} style={styles.close}>
          ✕
        </button>
        <div style={styles.content}>
          {/* 🐉 Immagine di Totoro */}
          <img
            src="https://firebasestorage.googleapis.com/v0/b/aurora2-8d28f.firebasestorage.app/o/totoro-morning.png?alt=media&token=5d3f5c7f-1d2a-4f1e-9c8d-5e3f5c7f1d2a"
            alt="Totoro"
            style={styles.image}
            onError={(e) => {
              e.target.style.display = 'none';
              // Puoi aggiungere un fallback testuale
            }}
          />
          <p style={styles.message}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

// ✅ Stili
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.6s ease-out'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '420px',
    padding: '24px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
    position: 'relative',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  close: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#f1f3f5',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#5f6368',
    transition: 'background 0.3s'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  image: {
    width: '90px',
    height: '90px',
    marginBottom: '18px',
    borderRadius: '8px'
  },
  message: {
    fontSize: '16px',
    color: '#202124',
    lineHeight: '1.7',
    margin: 0,
    fontStyle: 'italic'
  }
};

// 🌠 Animazione fadeIn
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  styleSheet.insertRule(`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `, styleSheet.cssRules.length);
}

export default MorningGreeting;