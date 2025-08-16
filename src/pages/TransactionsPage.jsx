// src/pages/TransactionsPage.jsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { 
  getUserAccounts, 
  getUserTransactions, 
  getUserCategories 
} from '../firebase/firestore';
import AddTransactionForm from '../components/AddTransactionForm';
import Layout from '../components/Layout';

const TransactionsPage = () => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userAccounts = await getUserAccounts(currentUser.uid);
          const userTransactions = await getUserTransactions(currentUser.uid);
          const userCategories = await getUserCategories(currentUser.uid);

          setAccounts(userAccounts);
          setTransactions(userTransactions);
          setCategories(userCategories);
        } catch (error) {
          console.error('Errore nel caricamento dati:', error);
        }
      } else {
        setUser(null);
        setAccounts([]);
        setTransactions([]);
        setCategories([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTransactionAdded = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          Caricamento dati...
        </div>
      </Layout>
    );
  }

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
        <h1 style={{ margin: 0, color: '#343a40' }}>Movimenti</h1>
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

      {/* Form per aggiungere una transazione */}
      <AddTransactionForm 
        userId={user.uid} 
        accounts={accounts} 
        categories={categories} 
        onTransactionAdded={handleTransactionAdded} 
      />

      {/* Tabella transazioni */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginTop: '30px'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#495057', 
          fontSize: '18px', 
          marginBottom: '20px' 
        }}>
          Elenco Movimenti
        </h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          fontSize: '14px' 
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f3f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>
                Data
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>
                Descrizione
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>
                Categoria
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>
                Tipo
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>
                Conto
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>
                Importo
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => {
                const fromAcc = accounts.find(acc => acc.id === t.fromAccountId);
                const category = categories.find(cat => cat.id === t.categoryId);
                return (
                  <tr key={t.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {t.date}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {t.description}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {category?.name || 'Nessuna'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      <span style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        borderRadius: '4px',
                        color: 'white',
                        backgroundColor: 
                          t.type === 'income' ? '#28a745' :
                          t.type === 'expense' ? '#dc3545' :
                          '#6c757b'
                      }}>
                        {t.type === 'income' ? 'Entrata' : t.type === 'expense' ? 'Uscita' : 'Giroconto'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {fromAcc?.name || 'N/D'}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      color: t.amount > 0 ? '#28a745' : '#dc3545'
                    }}>
                      € {Math.abs(t.amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '12px', color: '#6c757d' }}>
                  Nessuna transazione disponibile
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default TransactionsPage;