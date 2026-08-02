import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDX82Stm3MRg1HiwxLp_6Zo3JJrdJ1aS54",
  authDomain: "shopping-list-1b4e4.firebaseapp.com",
  projectId: "shopping-list-1b4e4",
  storageBucket: "shopping-list-1b4e4.firebasestorage.app",
  messagingSenderId: "149794456838",
  appId: "1:149794456838:web:f4a4c15d5142c56b18ca87",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
