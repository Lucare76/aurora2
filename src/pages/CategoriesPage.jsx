// src/pages/CategoriesPage.jsx

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app, db } from '../firebase/firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getUserCategories, addCategory } from '../firebase/firestore';
import Layout from '../components/Layout';

const CategoriesPage = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userCategories = await getUserCategories(currentUser.uid);
          setCategories(userCategories);
        } catch (error) {
          console.error('Errore nel caricamento categorie:', error);
        }
      } else {
        setUser(null);
        setCategories([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return;

    const newCategory = {
      name,
      type,
      userId: user.uid,
      subcategories: []
    };

    try {
      await addCategory(newCategory);
      setName('');
      const updated = await getUserCategories(user.uid);
      setCategories(updated);
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !newSubcategoryName) return;

    const category = categories.find(cat => cat.id === selectedCategoryId);
    const newSub = { id: Date.now().toString(), name: newSubcategoryName };
    const updatedSubs = [...(category.subcategories || []), newSub];

    try {
      await updateDoc(doc(db, 'categories', selectedCategoryId), {
        subcategories: updatedSubs
      });
      setNewSubcategoryName('');
      setSelectedCategoryId('');
      const updated = await getUserCategories(user.uid);
      setCategories(updated);
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  // ✅ Elimina una sotto-categoria
  const handleDeleteSubcategory = async (categoryId, subId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa sotto-categoria?')) return;

    const category = categories.find(cat => cat.id === categoryId);
    const updatedSubs = category.subcategories.filter(sub => sub.id !== subId);

    try {
      await updateDoc(doc(db, 'categories', categoryId), {
        subcategories: updatedSubs
      });
      const updated = await getUserCategories(user.uid);
      setCategories(updated);
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  // ✅ Elimina una categoria
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa categoria e tutte le sue sotto-categorie?')) return;

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      const updated = await getUserCategories(user.uid);
      setCategories(updated);
    } catch (error) {
      alert('Errore: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          Caricamento categorie...
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
        <h1 style={{ margin: 0, color: '#343a40' }}>Categorie</h1>
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

      {/* Form: Aggiungi categoria */}
      <form onSubmit={handleAdd} style={styles.form}>
        <h3 style={styles.title}>Aggiungi una categoria</h3>
        <input
          type="text"
          placeholder="Nome (es. Abbigliamento)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
          <option value="expense">Uscita</option>
          <option value="income">Entrata</option>
        </select>
        <button type="submit" style={styles.button}>
          Aggiungi Categoria
        </button>
      </form>

      {/* Form: Aggiungi sotto-categoria */}
      <form onSubmit={handleAddSubcategory} style={styles.form}>
        <h3 style={styles.title}>Aggiungi una sotto-categoria</h3>
        <select 
          value={selectedCategoryId} 
          onChange={(e) => setSelectedCategoryId(e.target.value)} 
          style={styles.select}
        >
          <option value="">Seleziona una categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nome della sotto-categoria"
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Aggiungi Sotto-Categoria
        </button>
      </form>

      {/* Tabella categorie */}
      <div style={styles.tableContainer}>
        <h3 style={styles.tableTitle}>Elenco Categorie</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Nome</th>
              <th style={styles.headerCell}>Tipo</th>
              <th style={styles.headerCell}>Sotto-Categorie</th>
              <th style={styles.headerCell}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td style={styles.cell}>{cat.name}</td>
                <td style={styles.cell}>
                  <span style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    color: 'white',
                    backgroundColor: cat.type === 'income' ? '#28a745' : '#dc3545'
                  }}>
                    {cat.type === 'income' ? 'Entrata' : 'Uscita'}
                  </span>
                </td>
                <td style={styles.cell}>
                  <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
                    {cat.subcategories?.map(sub => (
                      <li key={sub.id}>
                        {sub.name}
                        <button
                          onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                          style={btn.deleteSub}
                        >
                          ✖️
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={styles.cell}>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    style={btn.deleteCat}
                  >
                    Elimina Categoria
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

// ✅ Stili
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

// ✅ Stili pulsanti
const btn = {
  deleteSub: {
    marginLeft: '10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  deleteCat: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer'
  }
};

export default CategoriesPage;