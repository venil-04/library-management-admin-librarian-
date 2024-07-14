import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyA_qK5wv0XQrhYymEsY9GX6Hcsm-kc6AHY",
  authDomain: "odoo-hackathon-c14b2.firebaseapp.com",
  projectId: "odoo-hackathon-c14b2",
  storageBucket: "odoo-hackathon-c14b2.appspot.com",
  messagingSenderId: "168621569714",
  appId: "1:168621569714:web:57560be6642c75ec037bab"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { database, storage,firestore ,auth};

