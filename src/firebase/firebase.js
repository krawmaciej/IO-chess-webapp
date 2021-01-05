import firebase from 'firebase';


/*
-----Account info-----
login:  IO.chessonline.CGK
passwd:  4kuGNbsqBM

-----Players-----
player1@emial.com
qwerty
-----
player2@email.com
qwerty
-----
*/

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
export const database = firebase.database;


/* 
const firebaseConfig = {
  apiKey: "AIzaSyCREYaGIKnRdtJWqF4flyWOnmkTyL_ftz0", // process.env.REACT_APP_FBASE_API_KEY,
  authDomain: "io-chess-webapp.firebaseapp.com",
  databaseURL: "https://io-chess-webapp.firebaseio.com",
  projectId: "io-chess-webapp",
  storageBucket: "io-chess-webapp.appspot.com",
  messagingSenderId: "263037008208", //process.env.REACT_APP_FBASE_MESSAGING_SENDER_ID,
  appId: "1:263037008208:web:50b135d6e33e52d3ea9455", //process.env.REACT_APP_FBASE_APP_ID
};

dekar config
const firebaseConfig = {
  apiKey: "AIzaSyAbiN8dJGYZf3WKMSKS-eh7THGNiVOdjyE",
  authDomain: "io-chess-online.firebaseapp.com",
  databaseURL: 'https://io-chess-online-default-rtdb.firebaseio.com/',
  projectId: "io-chess-online",
  storageBucket: "io-chess-online.appspot.com",
  messagingSenderId: "596116793454",
  appId: "1:596116793454:web:4ba1c03df6344a58321e7f"
};
 */

