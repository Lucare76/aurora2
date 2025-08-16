// src/pages/ResourcesPage.jsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { getUserAccounts, updateAccount, deleteAccount } from '../firebase/firestore';
import AddAccountForm from '../components/AddAccountForm';
import Layout from '../components/Layout';

const ResourcesPage = () => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState(null);

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

  const handleDelete = async (accountId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo conto?')) {
      try {
        await deleteAccount(accountId);
        setAccounts(accounts.filter(acc => acc.id !== accountId));
      } catch (error) {
        alert('Errore: ' + error.message);
      }
    }
  };

  const handleEdit = (account) => {
    setEditingAccount({ ...account });
  };

  const handleSaveEdit = async () => {
    if (!editingAccount.name || editingAccount.balance == null) {
      alert('Nome e saldo sono obbligatori');
      return;
    }

    try {
      await updateAccount(editingAccount.id, {
        name: editingAccount.name,
        balance: parseFloat(editingAccount.balance) || 0
      });
      setAccounts(accounts.map(acc =>
        acc.id === editingAccount.id ? editingAccount : acc
      ));
      setEditingAccount(null);
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  const handleArchive = async (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    const newStatus = account.status === 'inactive' ? 'active' : 'inactive';

    try {
      await updateAccount(accountId, { status: newStatus });
      setAccounts(accounts.map(acc =>
        acc.id === accountId ? { ...acc, status: newStatus } : acc
      ));
    } catch (error) {
      alert('Errore: ' + error.message);
    }
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

  const activeAccounts = accounts.filter(acc => acc.status !== 'inactive');
  const inactiveAccounts = accounts.filter(acc => acc.status === 'inactive');
  const totalBalance = activeAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

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
        <h1 style={{ margin: 0, color: '#343a40' }}>Risorse</h1>
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

      {/* Form aggiungi risorsa */}
      <AddAccountForm 
        userId={user?.uid} 
        onAccountAdded={() => window.location.reload()} 
      />

      {/* Saldo totale */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#495057', fontSize: '18px', marginBottom: '12px' }}>
          Saldo Totale
        </h2>
        <p style={{ 
          fontSize: '2.2em', 
          fontWeight: 'bold', 
          color: '#27ae60', 
          margin: '10px 0'
        }}>
          € {totalBalance.toFixed(2)}
        </p>
      </div>

      {/* Tabella risorse attive */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#495057', 
          fontSize: '18px', 
          marginBottom: '20px' 
        }}>
          Risorse Attive
        </h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          fontSize: '14px' 
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f3f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>
                Risorsa
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>
                Saldo
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6c757d' }}>
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {activeAccounts.map((acc) => (
              <tr key={acc.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {acc.name}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  € {acc.balance?.toFixed(2) || '0.00'}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <button onClick={() => handleEdit(acc)} style={btn.edit}>Modifica</button>
                  <button onClick={() => handleArchive(acc.id)} style={btn.archive}>Archivia</button>
                  <button onClick={() => handleDelete(acc.id)} style={btn.delete}>Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modifica */}
      {editingAccount && (
        <div style={editFormStyle}>
          <h3>Modifica risorsa</h3>
          <input
            type="text"
            value={editingAccount.name}
            onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
            placeholder="Nome"
            style={inputStyle}
          />
          <input
            type="number"
            step="0.01"
            value={editingAccount.balance}
            onChange={(e) => setEditingAccount({ ...editingAccount, balance: parseFloat(e.target.value) || 0 })}
            placeholder="Saldo"
            style={inputStyle}
          />
          <div>
            <button onClick={handleSaveEdit} style={btn.save}>Salva</button>
            <button onClick={() => setEditingAccount(null)} style={btn.cancel}>Annulla</button>
          </div>
        </div>
      )}

      {/* Archivio */}
      {inactiveAccounts.length > 0 && (
        <div style={archiveStyle}>
          <h3>Archivio</h3>
          <ul style={listStyle}>
            {inactiveAccounts.map(acc => (
              <li key={acc.id} style={listItemStyle}>
                {acc.name} (€ {acc.balance?.toFixed(2)})
                <button onClick={() => handleArchive(acc.id)} style={btn.reattiva}>Riattiva</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

// Stili
const btn = {
  edit: { padding: '4px 8px', backgroundColor: '#ffc107', color: 'white', border: 'none', marginRight: '5px' },
  archive: { padding: '4px 8px', backgroundColor: '#6c757b', color: 'white', border: 'none', marginRight: '5px' },
  delete: { padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none' },
  save: { padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', marginRight: '10px' },
  cancel: { padding: '8px 16px', backgroundColor: '#6c757b', color: 'white', border: 'none' },
  reattiva: { padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none' }
};

const editFormStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginTop: '30px' };
const archiveStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginTop: '30px' };
const listStyle = { listStyle: 'none', padding: 0 };
const listItemStyle = { padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' };
const inputStyle = { display: 'block', width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' };

export default ResourcesPage;