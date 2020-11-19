import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FBASE_API_KEY,
  authDomain: "io-chess-webapp.firebaseapp.com",
  databaseURL: "https://io-chess-webapp.firebaseio.com",
  projectId: "io-chess-webapp",
  storageBucket: "io-chess-webapp.appspot.com",
  messagingSenderId: process.env.REACT_APP_FBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FBASE_APP_ID
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;
export const db = firebase.database();