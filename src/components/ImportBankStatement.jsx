// src/components/ImportBankStatement.jsx

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { addTransaction } from '../firebase/firestore';

const ImportBankStatement = ({ onTransactionImported, userId, accounts }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setPreview([]);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Salta le prime 8 righe di intestazione
        const startIndex = 8;
        const rows = jsonData.slice(startIndex).filter(row => row.length > 0);

        if (rows.length === 0) {
          setError('Nessun dato trovato nel file');
          return;
        }

        // Prendi il primo conto come predefinito
        if (accounts.length > 0 && !selectedAccountId) {
          setSelectedAccountId(accounts[0].id);
        }

        // Crea anteprima (prime 5 righe)
        const previewData = rows.slice(0, 5).map(row => ({
          date: row[0] || '',
          description: row[4] || '',
          amount: row[2] ? `-${row[2]}` : row[3] || ''
        }));

        setPreview(previewData);
      } catch (err) {
        setError('Errore nella lettura del file Excel');
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleImport = async () => {
    if (!file) return;
    if (!selectedAccountId) {
      setError('Seleziona un conto');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const startIndex = 8;
        const rows = jsonData.slice(startIndex).filter(row => row.length > 0);

        for (const row of rows) {
          const rawDate = row[0];
          const description = row[4] || 'Transazione senza descrizione';
          const amount = row[2] ? -parseFloat(row[2]) : parseFloat(row[3]);

          if (!rawDate || isNaN(amount)) continue;

          // Formatta la data
          let date = rawDate;
          if (rawDate instanceof Date) {
            date = rawDate.toISOString().split('T')[0];
          } else if (typeof rawDate === 'string') {
            const [d, m, y] = rawDate.split('/');
            date = `${y}-${m}-${d}`;
          }

          const newTransaction = {
            date,
            description,
            amount: Math.abs(amount),
            type: amount >= 0 ? 'income' : 'expense',
            accountId: selectedAccountId,
            userId: userId,
            createdAt: new Date().toISOString()
          };

          try {
            await addTransaction(newTransaction);
            onTransactionImported(newTransaction);
          } catch (err) {
            console.error('Errore aggiungendo transazione:', err);
          }
        }

        alert('Importazione completata!');
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Errore durante l\'importazione');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📥 Importa Estratto Conto</h3>

      <input type="file" accept=".xlsx" onChange={handleFileUpload} style={styles.fileInput} />

      {error && <p style={styles.error}>{error}</p>}

      {preview.length > 0 && (
        <>
          <div style={styles.accountSelect}>
            <label>Conto associato: </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              style={styles.select}
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          <h4 style={styles.subtitle}>Anteprima:</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrizione</th>
                <th>Importo</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>{row.description}</td>
                  <td>{row.amount} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleImport} disabled={loading} style={styles.button}>
            {loading ? 'Importazione...' : 'Importa Transazioni'}
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '20px' },
  title: { margin: '0 0 15px 0', fontSize: '18px', color: '#333' },
  fileInput: { marginBottom: '15px', padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' },
  error: { color: '#dc3545', marginBottom: '10px' },
  subtitle: { margin: '15px 0 10px 0', fontSize: '16px', color: '#555' },
  accountSelect: { marginBottom: '15px' },
  select: { padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginBottom: '15px' },
  button: { padding: '10px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default ImportBankStatement;