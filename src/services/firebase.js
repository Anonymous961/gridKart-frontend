import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-DxnAqyLm7Iypz6KH1Z-6XllQOw6VKLw",
  authDomain: "gridkart-a930f.firebaseapp.com",
  projectId: "gridkart-a930f",
  storageBucket: "gridkart-a930f.appspot.com",
  messagingSenderId: "641307015914",
  appId: "1:641307015914:web:6cd039be8085b36316f593"
};

const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {app,auth,db,storage};