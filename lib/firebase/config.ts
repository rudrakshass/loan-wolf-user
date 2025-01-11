import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA5sOhm1GcbNFLqFcuPfzODHw9WO7Xog3g",
  authDomain: "loan-wolf-c4073.firebaseapp.com",
  projectId: "loan-wolf-c4073",
  storageBucket: "loan-wolf-c4073.firebasestorage.app",
  messagingSenderId: "758982534276",
  appId: "1:758982534276:web:26b62f8cde6e36a9060ed1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
