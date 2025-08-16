// src/components/AddAccountForm.jsx

import React, { useState } from 'react';
import { addAccount } from '../firebase/firestore';

const AddAccountForm = ({ userId, onAccountAdded }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !balance) {
      alert('Nome e saldo sono obbligatori');
      return;
    }

    const newAccount = {
      name,
      balance: parseFloat(balance),
      userId,
      status: 'active'
    };

    try {
      await addAccount(newAccount);
      setName('');
      setBalance('');
      if (onAccountAdded) onAccountAdded();
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.title}>Aggiungi una risorsa</h3>
      <input
        type="text"
        placeholder="Nome (es. Contanti, Bancoposta)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
        required
      />
      <input
        type="number"
        step="0.01"
        placeholder="Saldo iniziale"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        style={styles.input}
        required
      />
      <button type="submit" style={styles.button}>
        Aggiungi Risorsa
      </button>
    </form>
  );
};

const styles = {
  form: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    color: '#333'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};

export default AddAccountForm;