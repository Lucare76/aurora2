// src/pages/BirthdaysPage.jsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app, db } from '../firebase/firebaseConfig';
import { 
  getUserBirthdays, 
  addBirthday 
} from '../firebase/firestore';
import { 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import Layout from '../components/Layout';

const BirthdaysPage = () => {
  const [user, setUser] = useState(null);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('birthday');
  const [editing, setEditing] = useState(null);
  const [showBirthdays, setShowBirthdays] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userBirthdays = await getUserBirthdays(currentUser.uid);
          setBirthdays(userBirthdays);

          const saved = localStorage.getItem(`birthdaySettings_${currentUser.uid}`);
          if (saved) {
            setShowBirthdays(JSON.parse(saved));
          }
        } catch (error) {
          console.error('Errore nel caricamento compleanni:', error);
        }
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

  const handleEdit = (b) => {
    setEditing({ ...b });
  };

  const handleSaveEdit = async () => {
    if (!editing.name || !editing.date) return;

    try {
      await updateDoc(doc(db, 'birthdays', editing.id), {
        name: editing.name,
        date: editing.date,
        type: editing.type
      });
      setBirthdays(birthdays.map(b => b.id === editing.id ? editing : b));
      setEditing(null);
    } catch (error) {
      alert('Errore nel salvataggio: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo compleanno?')) return;

    try {
      await deleteDoc(doc(db, 'birthdays', id));
      setBirthdays(birthdays.filter(b => b.id !== id));
    } catch (error) {
      alert('Errore nell’eliminazione: ' + error.message);
    }
  };

  const handleToggleShow = () => {
    const newValue = !showBirthdays;
    setShowBirthdays(newValue);
    if (user) {
      localStorage.setItem(`birthdaySettings_${user.uid}`, JSON.stringify(newValue));
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

  const sorted = [...birthdays].sort((a, b) => a.date.slice(5) > b.date.slice(5) ? 1 : -1);

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

      <div style={{
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <label>
          <input
            type="checkbox"
            checked={showBirthdays}
            onChange={handleToggleShow}
          />
          Mostra notifiche compleanni
        </label>
      </div>

      <form onSubmit={handleAdd} style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '18px',
          color: '#333'
        }}>Aggiungi una ricorrenza</h3>
        <input
          type="text"
          placeholder="Nome (es. Mamma, Nonno)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{
          display: 'block',
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <option value="birthday">Compleanno</option>
          <option value="saint">Santo</option>
          <option value="anniversary">Anniversario</option>
        </select>
        <button type="submit" style={{
          padding: '10px 16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '500'
        }}>
          Aggiungi Ricorrenza
        </button>
      </form>

      {showBirthdays && (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '18px',
            color: '#495057'
          }}>Elenco Ricorrenze</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f3f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>Nome</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>Data</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>Tipo</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(b => (
                <tr key={b.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    {editing?.id === b.id ? (
                      <input
                        value={editing.name}
                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        style={{ padding: '2px', width: '100%' }}
                      />
                    ) : (
                      b.name
                    )}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    {editing?.id === b.id ? (
                      <input
                        type="date"
                        value={editing.date}
                        onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                        style={{ padding: '2px' }}
                      />
                    ) : (
                      b.date
                    )}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    {editing?.id === b.id ? (
                      <select
                        value={editing.type}
                        onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                        style={{ padding: '2px' }}
                      >
                        <option value="birthday">Compleanno</option>
                        <option value="saint">Santo</option>
                        <option value="anniversary">Anniversario</option>
                      </select>
                    ) : (
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
                    )}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    {editing?.id === b.id ? (
                      <>
                        <button onClick={handleSaveEdit} style={{
                          padding: '6px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          marginRight: '5px'
                        }}>Salva</button>
                        <button onClick={() => setEditing(null)} style={{
                          padding: '6px 12px',
                          backgroundColor: '#6c757b',
                          color: 'white',
                          border: 'none'
                        }}>Annulla</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(b)} style={{
                          padding: '4px 8px',
                          backgroundColor: '#ffc107',
                          color: 'white',
                          border: 'none',
                          marginRight: '5px'
                        }}>Modifica</button>
                        <button onClick={() => handleDelete(b.id)} style={{
                          padding: '4px 8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none'
                        }}>Elimina</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default BirthdaysPage;