import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "raje-ba146.firebaseapp.com",
    projectId: "raje-ba146",
    storageBucket: "raje-ba146.firebasestorage.app",
    messagingSenderId: "814284822596",
    appId: "1:814284822596:web:38b69874155a94ace90411"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
