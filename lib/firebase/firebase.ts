import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBr1SYXakdTDTVXj8W0xMaSTNi5Oo1I_r0",
  authDomain: "chat-with-pdf-82ad1.firebaseapp.com",
  projectId: "chat-with-pdf-82ad1",
  storageBucket: "chat-with-pdf-82ad1.appspot.com",
  messagingSenderId: "968829768677",
  appId: "1:968829768677:web:8c4031f9b8c1490bc6d50c",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };