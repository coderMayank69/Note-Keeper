import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCN7jc2UfXnLiKbR1G3Pb5dwMnY_NOLmtI",
  authDomain: "projects-4f4c8.firebaseapp.com",
  projectId: "projects-4f4c8",
  storageBucket: "projects-4f4c8.firebasestorage.app",
  messagingSenderId: "861423578334",
  appId: "1:861423578334:web:618cc2b6afa381428a664f",
  measurementId: "G-X4FG6JWMZ6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();