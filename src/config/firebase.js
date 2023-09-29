import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARwYMMznxYT9d01x2jVM4CTlI-OjaSdpU",
  authDomain: "clients-manage.firebaseapp.com",
  projectId: "clients-manage",
  storageBucket: "clients-manage.appspot.com",
  messagingSenderId: "208878519081",
  appId: "1:208878519081:web:cdc406b91fc7917fb12d38"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db }; 