// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { getUserAccounts } from '../firebase/firestore';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userAccounts = await getUserAccounts(currentUser.uid);
          setAccounts(userAccounts);
        } catch (error) {
          console.error('Errore nel caricamento conti:', error);
        }
      } else {
        setUser(null);
        setAccounts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          Caricamento dati...
        </div>
      </Layout>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

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
        <h1 style={{ margin: 0, color: '#343a40' }}>Dashboard</h1>
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

      {/* Saldo attuale */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#495057', fontSize: '18px', marginBottom: '12px' }}>
          Saldo Attuale
        </h2>
        <p style={{ 
          fontSize: '2.2em', 
          fontWeight: 'bold', 
          color: '#27ae60', 
          margin: '10px 0'
        }}>
          € {totalBalance.toFixed(2)}
        </p>
        <button style={{
          padding: '10px 24px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '500',
          transition: 'background 0.2s'
        }}
        onMouseOver={e => e.target.style.background = '#2980b9'}
        onMouseOut={e => e.target.style.background = '#3498db'}>
          Visualizza i movimenti
        </button>
      </div>

      {/* Disponibilità risorse */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#495057', 
          fontSize: '18px' 
        }}>
          Disponibilità risorse
        </h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          fontSize: '14px' 
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f3f5' }}>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                color: '#6c757d' 
              }}>
                Risorsa
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                color: '#6c757d' 
              }}>
                Saldo
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                color: '#6c757d' 
              }}>
                Stato
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.length > 0 ? (
              accounts.map((acc) => (
                <tr key={acc.id}>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6' 
                  }}>
                    {acc.name}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6' 
                  }}>
                    € {acc.balance?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #dee2e6' 
                  }}>
                    <span style={{
                      color: '#27ae60',
                      fontWeight: '500',
                      fontSize: '13px'
                    }}>
                      ✅ In uso
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '12px', color: '#6c757d' }}>
                  Nessuna risorsa disponibile
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Dashboard;