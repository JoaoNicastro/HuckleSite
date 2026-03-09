import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOHNSvyBbkzGaFWo5zrikLNQ3o0la3P0U",
    authDomain: "huckle-aa3ba.firebaseapp.com",
    projectId: "huckle-aa3ba",
    storageBucket: "huckle-aa3ba.firebasestorage.app",
    messagingSenderId: "341598430108",
    appId: "1:341598430108:web:cce4bd8b27bc8847369e59",
    measurementId: "G-SK67G26RTW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
