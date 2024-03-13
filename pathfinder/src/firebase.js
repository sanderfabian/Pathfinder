// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app"; 
import { getAuth, signInWithEmailAndPassword ,createUserWithEmailAndPassword } from "firebase/auth"; 
import { getFirestore } from 'firebase/firestore'; // Import getFirestore from firebase/firestore 
// TODO: Add SDKs for Firebase products that you want to use 
// https://firebase.google.com/docs/web/setup#available-libraries 
 
// Your web app's Firebase configuration 
const firebaseConfig = { 
  apiKey: "AIzaSyBRwRDCsuYUqP0T4SsHhuG6JLVxuUB5_aM",
  authDomain: "compb-12d22.firebaseapp.com",
  projectId: "compb-12d22",
  storageBucket: "compb-12d22.appspot.com",
  messagingSenderId: "1090811778809",
  appId: "1:1090811778809:web:31e7c5f77a98ec3e787428"
}; 
 
// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
const firestore = getFirestore(app); 
const auth = getAuth(app); 
 
export { auth ,firestore }; 
export { signInWithEmailAndPassword,createUserWithEmailAndPassword};

