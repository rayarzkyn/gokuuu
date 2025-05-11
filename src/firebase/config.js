// src/firebase/config.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyAVIHL_-0CziSSO_QHZhPKeCWvL9SAFg7U",
  authDomain: "stok-4bcdb.firebaseapp.com",
  projectId: "stok-4bcdb",
  storageBucket: "stok-4bcdb.appspot.com",
  messagingSenderId: "782809041749",
  appId: "1:782809041749:web:27e346d705e108e60efddc",
  measurementId: "G-YMBKYZZZXE"
};

// Cek apakah sudah ada instance Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
