// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVQVB267S2deAfXJlFSebO1xPnRTo9Ous",
  authDomain: "uination.firebaseapp.com",
  projectId: "uination",
  storageBucket: "uination.appspot.com",
  messagingSenderId: "206719647579",
  appId: "1:206719647579:web:b69760369e6511a69a247e",
  measurementId: "G-31BNS7ZC2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider).then((result) => {
        user = result.user;
    })
    .catch((err)=>{
        console.log(err)
    })
    
    return user;
}