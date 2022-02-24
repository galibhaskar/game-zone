// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKOlSFv2NzNUjzBsrjJTcT0kfvePq_K4Y",
  authDomain: "gamezone-e419b.firebaseapp.com",
  projectId: "gamezone-e419b",
  storageBucket: "gamezone-e419b.appspot.com",
  messagingSenderId: "364092416941",
  appId: "1:364092416941:web:6957eb61303ac27282b724",
  measurementId: "G-71WS3ZQ3JD",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const databaseRef = firebase.firestore();
// export const users = databaseRef.child("users");
// const analytics = getAnalytics(app);
