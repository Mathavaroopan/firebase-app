import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBsBvhvJeD2kQ91jsL0txWUpe3T9IzGki8",
  authDomain: "fir-basics-6c435.firebaseapp.com",
  projectId: "fir-basics-6c435",
  storageBucket: "fir-basics-6c435.appspot.com",
  messagingSenderId: "1053356009954",
  appId: "1:1053356009954:web:aeaf1ac6314f954e4531bb",
  measurementId: "G-4Q6FLM8WKZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);