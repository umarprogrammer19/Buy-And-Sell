import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

// My Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCW97xBpb1_10PLcto1FyUBSVECQpvTgG8",
    authDomain: "buy-and-sell-8232d.firebaseapp.com",
    projectId: "buy-and-sell-8232d",
    storageBucket: "buy-and-sell-8232d.appspot.com",
    messagingSenderId: "72761946380",
    appId: "1:72761946380:web:34b7a0febb56c1f5185929",
    measurementId: "G-DWRY3PNZN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();