import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArVyBRB-XMiStAmjP5mCV2v2PmScbEpi8",
  authDomain: "integrity-step-capstone.firebaseapp.com",
  databaseURL: "https://integrity-step-capstone.firebaseio.com",
  projectId: "integrity-step-capstone",
  storageBucket: "integrity-step-capstone.appspot.com",
  messagingSenderId: "359578935158",
  appId: "1:359578935158:web:89d46122b0609b4a95a457",
  measurementId: "G-GMNRGZQ858"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();


const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const getUserID = () =>{
  var user = firebase.auth().currentUser;
  if (user != null) 
  {
    console.log("User UID is is " + user.uid)
    return user.uid;
  }
  else
  {
    console.log("User is none")
  }
};
