import firebase from 'firebase';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FBASE_API_KEY,
    authDomain: process.env.REACT_APP_FBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FBASE_APP_ID
  };

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;
export const db = firebase.database();