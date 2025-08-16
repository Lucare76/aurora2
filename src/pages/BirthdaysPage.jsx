// src/pages/BirthdaysPage.jsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { getUserBirthdays, addBirthday } from '../firebase/firestore';
import Layout from '../components/Layout';

const BirthdaysPage = () => {
  const [user, setUser] = useState(null);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('birthday'); // birthday, saint, anniversary

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userBirthdays = await getUserBirthdays(currentUser.uid);
          setBirthdays(userBirthdays);
        } catch (error) {
          console.error('Errore nel caricamento compleanni:', error);
        }
      } else {
        setUser(null);
        setBirthdays([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !date) return;

    const newBirthday = {
      name,
      date,
      type,
      userId: user.uid
    };

    try {
      await addBirthday(newBirthday);
      setName('');
      setDate('');
      const updated = await getUserBirthdays(user.uid);
      setBirthdays(updated);
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          Caricamento compleanni...
        </div>
      </Layout>
    );
  }

  // Ordina per data (mese e giorno)
  const sorted = [...birthdays].sort((a, b) => {
    return a.date.slice(5) > b.date.slice(5) ? 1 : -1;
  });

  return (
    <Layout>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #dee2e6',
        paddingBottom: '15px'
      }}>
        <h1 style={{ margin: 0, color: '#343a40' }}>Compleanni & Ricorrenze</h1>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          fontSize: '14px'
        }}>
          <span>Benvenuto!</span>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#3498db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            TU
          </div>
        </div>
      </header>

      {/* Form aggiungi */}
      <form onSubmit={handleAdd} style={styles.form}>
        <h3 style={styles.title}>Aggiungi una ricorrenza</h3>
        <input
          type="text"
          placeholder="Nome (es. Mamma, Nonno)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
          <option value="birthday">Compleanno</option>
          <option value="saint">Santo</option>
          <option value="anniversary">Anniversario</option>
        </select>
        <button type="submit" style={styles.button}>
          Aggiungi Ricorrenza
        </button>
      </form>

      {/* Tabella */}
      <div style={styles.tableContainer}>
        <h3 style={styles.tableTitle}>Elenco Ricorrenze</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Nome</th>
              <th style={styles.headerCell}>Data</th>
              <th style={styles.headerCell}>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(b => (
              <tr key={b.id}>
                <td style={styles.cell}>{b.name}</td>
                <td style={styles.cell}>{b.date}</td>
                <td style={styles.cell}>
                  <span style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    color: 'white',
                    backgroundColor: 
                      b.type === 'birthday' ? '#e67e22' :
                      b.type === 'saint' ? '#9b59b6' : '#1abc9c'
                  }}>
                    {b.type === 'birthday' ? '🎂' :
                     b.type === 'saint' ? '✝️' : '💍'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
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
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  tableContainer: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  tableTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    color: '#495057'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  headerRow: { backgroundColor: '#f1f3f5' },
  headerCell: {
    padding: '12px',
    textAlign: 'left',
    color: '#6c757d'
  },
  cell: {
    padding: '12px',
    borderBottom: '1px solid #dee2e6'
  }
};

export default BirthdaysPage;