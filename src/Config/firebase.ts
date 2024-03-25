import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATA6UZG5KWNGUIp7e_DYshd4sXnaSZYZ4",
  authDomain: "aveu-b493d.firebaseapp.com",
  projectId: "aveu-b493d",
  storageBucket: "aveu-b493d.appspot.com",
  messagingSenderId: "215730996210",
  appId: "1:215730996210:web:244a0016cb4254d74de16b",
  measurementId: "G-V5F1HYFKG3",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

