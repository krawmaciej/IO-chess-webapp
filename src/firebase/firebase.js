import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCREYaGIKnRdtJWqF4flyWOnmkTyL_ftz0", // process.env.REACT_APP_FBASE_API_KEY,
  authDomain: "io-chess-webapp.firebaseapp.com",
  databaseURL: "https://io-chess-webapp.firebaseio.com",
  projectId: "io-chess-webapp",
  storageBucket: "io-chess-webapp.appspot.com",
  messagingSenderId: "263037008208", //process.env.REACT_APP_FBASE_MESSAGING_SENDER_ID,
  appId: "1:263037008208:web:50b135d6e33e52d3ea9455", //process.env.REACT_APP_FBASE_APP_ID
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;
export const database = firebase.database;