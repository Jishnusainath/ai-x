import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { signInAnonymously, signOut, onAuthStateChanged, doc, setDoc, getDoc, collection, query, getDocs, addDoc, deleteDoc, updateDoc, GoogleAuthProvider, signInWithPopup };
export type { User };
