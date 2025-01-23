// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GithubAuthProvider, GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
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

// Initialize providers for Google and GitHub
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const auth = getAuth();

// Function for Google Authentication
export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, googleProvider)
        .then((result) => {
            user = result.user;
        })
        .catch((err) => {
        });
    
    return user;
};

export const authWithGithub = async () => {
    let user = null;

    await signInWithPopup(auth, githubProvider).then((result) => {
        user = result.user;
    }).catch((err) => {
    });
    return user;
}
