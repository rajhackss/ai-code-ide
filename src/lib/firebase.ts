import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "raje-ba146.firebaseapp.com",
    databaseURL: "https://raje-ba146.firebaseio.com",
    projectId: "raje-ba146",
    storageBucket: "raje-ba146.firebasestorage.app",
    messagingSenderId: "814284822596",
    appId: "1:814284822596:web:04fdda277ad50b63e90411"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
