// src/pages/TransactionsPage.jsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { 
  getUserAccounts, 
  getUserTransactions, 
  addTransaction 
} from '../firebase/firestore';
import Layout from '../components/Layout';
import ImportBankStatement from '../components/ImportBankStatement';

const TransactionsPage = () => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'expense',
    accountId: '',
    categoryId: '',
    subcategoryId: ''
  });

  // Stati per categorie e sottocategorie
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userAccounts = await getUserAccounts(currentUser.uid);
          const userTransactions = await getUserTransactions(currentUser.uid);
          
          setAccounts(userAccounts);
          setTransactions(userTransactions);

          // Imposta il primo conto come predefinito
          if (userAccounts.length > 0 && !form.accountId) {
            setForm(prev => ({ ...prev, accountId: userAccounts[0].id }));
          }
        } catch (error) {
          console.error('Errore nel caricamento dati:', error);
        }
      } else {
        setUser(null);
        setAccounts([]);
        setTransactions([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Resetta sottocategorie se cambia la categoria
    if (name === 'categoryId') {
      const selectedCat = categories.find(c => c.id === value);
      setSubcategories(selectedCat?.subcategories || []);
      setForm(prev => ({ ...prev, subcategoryId: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.description || !form.amount || !form.accountId) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const newTransaction = {
      ...form,
      amount: parseFloat(form.amount),
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    try {
      await addTransaction(newTransaction);
      setForm({
        date: '',
        description: '',
        amount: '',
        type: 'expense',
        accountId: form.accountId,
        categoryId: '',
        subcategoryId: ''
      });
      // Ricarica le transazioni
      const updated = await getUserTransactions(user.uid);
      setTransactions(updated);
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          Caricamento...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header style={styles.header}>
        <h1 style={styles.title}>💰 Movimenti</h1>
      </header>

      {/* Componente di importazione */}
      <ImportBankStatement 
        onTransactionImported={(newTrans) => setTransactions(prev => [newTrans, ...prev])}
        userId={user.uid}
        accounts={accounts}
      />

      {/* Form aggiungi transazione */}
      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>Aggiungi una transazione</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descrizione"
              style={styles.input}
              required
            />
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Importo"
              step="0.01"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="expense">Uscita</option>
              <option value="income">Entrata</option>
              <option value="transfer">Giroconto</option>
            </select>

            {/* Conto */}
            <select
              name="accountId"
              value={form.accountId}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Seleziona un conto</option>
              {accounts && accounts.length > 0 ? (
                accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.balance} €)
                  </option>
                ))
              ) : (
                <option disabled>Nessun conto disponibile</option>
              )}
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Aggiungi Movimento
          </button>
        </form>
      </div>

      {/* Tabella transazioni */}
      <div style={styles.tableContainer}>
        <h3 style={styles.tableTitle}>Elenco Movimenti</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Data</th>
              <th style={styles.headerCell}>Descrizione</th>
              <th style={styles.headerCell}>Tipo</th>
              <th style={styles.headerCell}>Conto</th>
              <th style={styles.headerCell}>Importo</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(t => (
                  <tr key={t.id}>
                    <td style={styles.cell}>{t.date}</td>
                    <td style={styles.cell}>{t.description}</td>
                    <td style={styles.cell}>
                      <span style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        borderRadius: '4px',
                        color: 'white',
                        backgroundColor: 
                          t.type === 'income' ? '#28a745' :
                          t.type === 'expense' ? '#dc3545' : '#6c757b'
                      }}>
                        {t.type === 'income' ? 'Entrata' : t.type === 'expense' ? 'Uscita' : 'Giroconto'}
                      </span>
                    </td>
                    <td style={styles.cell}>
                      {accounts.find(acc => acc.id === t.accountId)?.name || 'Sconosciuto'}
                    </td>
                    <td style={{
                      ...styles.cell,
                      fontWeight: 'bold',
                      color: t.amount > 0 ? '#28a745' : '#dc3545'
                    }}>
                      € {t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '12px', color: '#6c757d' }}>
                  Nessuna transazione
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

// Stili
const styles = {
  header: {
    marginBottom: '30px',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '15px'
  },
  title: {
    margin: 0,
    color: '#343a40'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '30px'
  },
  formTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  input: {
    flex: 1,
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  select: {
    flex: 1,
    padding: '8px',
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
    fontWeight: '500',
    alignSelf: 'start'
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

export default TransactionsPage;