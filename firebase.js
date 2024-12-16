// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCFa34udaWK9z8dUbYtt0DrIY3mc-nbyVk",
  authDomain: "esg-data-ea8f7.firebaseapp.com",
  projectId: "esg-data-ea8f7",
  storageBucket: "esg-data-ea8f7.firebasestorage.app",
  messagingSenderId: "629845828064",
  appId: "1:629845828064:web:87ac31663d9fab5f218b85",
  measurementId: "G-XPH509XVQE",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
