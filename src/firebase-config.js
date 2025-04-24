import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD4lX725Y0ki-dnvRjy6ZRBCWF1RhrXxKQ",
  authDomain: "project-472d5.firebaseapp.com",
  databaseURL: "https://project-472d5-default-rtdb.firebaseio.com",
  projectId: "project-472d5",
  storageBucket: "project-472d5.firebasestorage.app",
  messagingSenderId: "843067934950",
  appId: "1:843067934950:web:924066e696bb81bb7f9327"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };