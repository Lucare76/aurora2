// src/firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjnQw4gnlB_EHQYwumi0_IwtdBfDJ4KOk",
  authDomain: "aurora2-8d28f.firebaseapp.com",
  projectId: "aurora2-8d28f",
  storageBucket: "aurora2-8d28f.firebasestorage.app",
  messagingSenderId: "668958903802",
  appId: "1:668958903802:web:f64c3cc584da9efc692843"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Esporta per uso in tutta l'app
export { app, db };