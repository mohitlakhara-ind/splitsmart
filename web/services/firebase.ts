import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJGaidqikcXoc4gekxqZOS67psV6ls_Ek",
  authDomain: "splitsmart-app-18342.firebaseapp.com",
  projectId: "splitsmart-app-18342",
  storageBucket: "splitsmart-app-18342.firebasestorage.app",
  messagingSenderId: "14416515704",
  appId: "1:14416515704:web:658356ad628d41802d138d",
  measurementId: "G-SDY9ZRV9V4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google popup
export const signInWithGoogle = async (): Promise<string> => {
  const result = await signInWithPopup(auth, googleProvider);
  // Get the ID token to send to your backend
  const idToken = await result.user.getIdToken();
  return idToken;
};

export { auth, googleProvider };

