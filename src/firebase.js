// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  /*
  apiKey: "AIzaSyBN_E8nTYqaO0SIBi3ebRORmhlXOFw4MHY",
  authDomain: "inv-support-a943a.firebaseapp.com",
  projectId: "inv-support-a943a",
  storageBucket: "inv-support-a943a.appspot.com",
  messagingSenderId: "384364270018",
  appId: "1:384364270018:web:6adeaee73309622860865b",
  measurementId: "G-YVBSFPNPMR"
  */

  
  apiKey: "AIzaSyDtuS4c2ieAUR1fQjIdBU8DdOnfaoescos",
  authDomain: "it-support-5eda1.firebaseapp.com",
  projectId: "it-support-5eda1",
  storageBucket: "it-support-5eda1.appspot.com",
  messagingSenderId: "35829011497",
  appId: "1:35829011497:web:fb2fb1feb0cc54484ff838",
  measurementId: "G-4Z0ZPEXWPH"

  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app)
export {db}