// src/firebase/initialSetup.js

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { addAccount } from './firestore';

// Conti predefiniti
const defaultAccounts = [
  { name: 'Contanti', type: 'cash', balance: 0, status: 'active' },
  { name: 'Bancoposta', type: 'bank', balance: 0, status: 'active' },
  { name: 'Postepay', type: 'digital', balance: 0, status: 'active' }
];

// Funzione per creare i conti iniziali
export const setupUserAccounts = async (userId) => {
  const q = query(collection(db, 'accounts'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log('Nessun conto trovato. Creazione dei conti predefiniti...');
    for (const acc of defaultAccounts) {
      await addAccount({ ...acc, userId });
    }
    console.log('✅ Conti predefiniti creati per l’utente:', userId);
  }
};