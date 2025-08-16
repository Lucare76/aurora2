// src/components/AddTransactionForm.jsx

import React, { useState } from 'react';
import { addTransaction } from '../firebase/firestore';

const AddTransactionForm = ({ 
  userId, 
  accounts = [], 
  categories = [], 
  onTransactionAdded 
}) => {
  const [type, setType] = useState('income');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount) {
      alert('Descrizione e importo sono obbligatori');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Importo non valido');
      return;
    }

    let transactionData = {
      date,
      description,
      amount: type === 'expense' ? -amountNum : amountNum,
      type,
      userId
    };

    if (categoryId) transactionData.categoryId = categoryId;

    if (type === 'transfer') {
      if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
        alert('Conti di partenza e arrivo diversi');
        return;
      }
      transactionData.fromAccountId = fromAccountId;
      transactionData.toAccountId = toAccountId;
    } else {
      if (!fromAccountId) {
        alert('Scegli un conto');
        return;
      }
      transactionData.fromAccountId = fromAccountId;
    }

    try {
      await addTransaction(transactionData);
      setDescription('');
      setAmount('');
      setCategoryId('');
      setFromAccountId('');
      setToAccountId('');
      if (onTransactionAdded) onTransactionAdded();
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.title}>Aggiungi una transazione</h3>

      <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
        <option value="income">Entrata</option>
        <option value="expense">Uscita</option>
        <option value="transfer">Giroconto</option>
      </select>

      <input
        type="text"
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.input}
        required
      />

      <input
        type="number"
        step="0.01"
        placeholder="Importo"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      />

      {type !== 'transfer' && (
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={styles.select}>
          <option value="">Scegli una categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      )}

      <select
        value={fromAccountId}
        onChange={(e) => setFromAccountId(e.target.value)}
        style={styles.select}
      >
        <option value="">Scegli il conto di partenza</option>
        {accounts.map(acc => (
          <option key={acc.id} value={acc.id}>{acc.name}</option>
        ))}
      </select>

      {type === 'transfer' && (
        <select
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
          style={styles.select}
        >
          <option value="">Scegli il conto di arrivo</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
      )}

      <button type="submit" style={styles.button}>
        Aggiungi Transazione
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
  select: {
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
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};

export default AddTransactionForm;