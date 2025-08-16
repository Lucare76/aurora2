// src/firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 🔹 Configurazione di Firebase (dal tuo progetto)
const firebaseConfig = {
  apiKey: "AIzaSyAjnQw4gnlB_EHQYwumi0_IwtdBfDJ4KOk",
  authDomain: "aurora2-8d28f.firebaseapp.com",
  projectId: "aurora2-8d28f",
  storageBucket: "aurora2-8d28f.firebasestorage.app",
  messagingSenderId: "668958903802",
  appId: "1:668958903802:web:f64c3cc584da9efc692843"
};

// 🔹 Inizializza Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Inizializza Firestore
const db = getFirestore(app);

// 🔹 Esporta app e db per usarli in tutto il progetto
export { app, db };