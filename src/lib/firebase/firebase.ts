// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz6Z2lwwIdgTo-2WT8e1FGdfFeW-8kuVE",
  authDomain: "road-to-xtreme-2-0.firebaseapp.com",
  projectId: "road-to-xtreme-2-0",
  storageBucket: "road-to-xtreme-2-0.firebasestorage.app",
  messagingSenderId: "167971376588",
  appId: "1:167971376588:web:824735cfb795cd944e2169",
  measurementId: "G-1N9K6NRDKZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);