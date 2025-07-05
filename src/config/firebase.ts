import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArwJ_3s0ByaJSqsP62qAWlVxc_tv7kd5o",
  authDomain: "my-monin.firebaseapp.com",
  projectId: "my-monin",
  storageBucket: "my-monin.firebasestorage.app",
  messagingSenderId: "414423193123",
  appId: "1:414423193123:web:ffe2097388fac53eee8396",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();
