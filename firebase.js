// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2FC_MgWfeBoIAMrytXAuOaVAjzmWhCNQ",
  authDomain: "quotes-elliott.firebaseapp.com",
  projectId: "quotes-elliott",
  storageBucket: "quotes-elliott.appspot.com",
  messagingSenderId: "624554638847",
  appId: "1:624554638847:web:b1a29bad1a274d171efbca",
  measurementId: "G-T577EQQ3BB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
