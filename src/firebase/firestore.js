// src/firebase/firestore.js

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// 🔹 Aggiungi un conto
export const addAccount = async (accountData) => {
  try {
    const docRef = await addDoc(collection(db, 'accounts'), {
      ...accountData,
      createdAt: new Date().toISOString(),
      status: accountData.status || 'active'
    });
    console.log('Conto aggiunto con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Errore aggiungendo il conto:', error);
    throw error;
  }
};

// 🔹 Ottieni tutti i conti dell'utente
export const getUserAccounts = async (userId) => {
  try {
    const q = query(collection(db, 'accounts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Errore nel caricamento dei conti:', error);
    throw error;
  }
};

// 🔹 Aggiorna un conto
export const updateAccount = async (accountId, accountData) => {
  try {
    await updateDoc(doc(db, 'accounts', accountId), accountData);
    console.log('Conto aggiornato:', accountId);
  } catch (error) {
    console.error('Errore nell’aggiornamento del conto:', error);
    throw error;
  }
};

// 🔹 Elimina un conto
export const deleteAccount = async (accountId) => {
  try {
    await deleteDoc(doc(db, 'accounts', accountId));
    console.log('Conto eliminato:', accountId);
  } catch (error) {
    console.error('Errore nell’eliminazione del conto:', error);
    throw error;
  }
};

// 🔹 Aggiungi una transazione
export const addTransaction = async (transactionData) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: new Date().toISOString()
    });
    console.log('Transazione aggiunta con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Errore aggiungendo la transazione:', error);
    throw error;
  }
};

// 🔹 Ottieni tutte le transazioni dell'utente
export const getUserTransactions = async (userId) => {
  try {
    const q = query(collection(db, 'transactions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Errore nel caricamento delle transazioni:', error);
    throw error;
  }
};

// 🔹 Aggiungi una categoria
export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: new Date().toISOString(),
      subcategories: categoryData.subcategories || []
    });
    console.log('Categoria aggiunta con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Errore aggiungendo la categoria:', error);
    throw error;
  }
};

// 🔹 Ottieni tutte le categorie dell'utente
export const getUserCategories = async (userId) => {
  try {
    const q = query(collection(db, 'categories'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Errore nel caricamento delle categorie:', error);
    throw error;
  }
};

// 🔹 Aggiungi un compleanno
export const addBirthday = async (birthdayData) => {
  try {
    const docRef = await addDoc(collection(db, 'birthdays'), {
      ...birthdayData,
      createdAt: new Date().toISOString()
    });
    console.log('Compleanno aggiunto con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Errore aggiungendo il compleanno:', error);
    throw error;
  }
};

// 🔹 Ottieni tutti i compleanni dell'utente
export const getUserBirthdays = async (userId) => {
  try {
    const q = query(collection(db, 'birthdays'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Errore nel caricamento dei compleanni:', error);
    throw error;
  }
};