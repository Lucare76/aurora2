// src/components/AuthButton.jsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AuthButton = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate('/dashboard', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert('Errore nel login: ' + error.message);
    }
  };

  if (user) {
    return null; // Reindirizzato da onAuthStateChanged
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Benvenuto in Aurora 2.0</h1>
      <p>Accedi con Google per continuare</p>
      <button onClick={handleLogin} style={buttonStyle}>
        🔐 Accedi con Google
      </button>
    </div>
  );
};

const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#4285F4',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default AuthButton;