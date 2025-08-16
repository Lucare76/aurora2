import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const addBirthday = async (birthdayData) => {
  const docRef = await addDoc(collection(db, 'birthdays'), {
    ...birthdayData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getUserBirthdays = async (userId) => {
  const q = query(collection(db, 'birthdays'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};