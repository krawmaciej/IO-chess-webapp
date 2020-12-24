// react
import React, { Component } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route
} from "react-router-dom";

// components
import Home from './components/Home/Home'
import SignIn from './components/SignIn/SignIn'
import SignUp from './components/SignUp/SignUp'
import Play from './components/Play/Play'
// firebase
import { auth, database } from './firebase/firebase'
// user
import { userCachedData, resetUserData, loadUserDataFromServer } from './user/userData.js';
// styles
import "./App.css";

// custom routes, like react route
import GuestRoute from './routes/guestRoute';
import UserRoute from './routes/userRoute';


/* ********************************** */
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      onAuthFinished: false,
      userData: userCachedData
    };
  }

  componentDidMount() {
    const callback = (data) => {
      loadUserDataFromServer(userCachedData, data);
      console.log("userDataFirst: ", userCachedData);
      // reload render
      this.setState({ onAuthFinished: true, userData: userCachedData }); // taki hack żeby poczekać na skończenie dziłania funkcji auth().onAuthStateChanged
    }
    auth().onAuthStateChanged(user => {
      // user logged in
      if (user) {
        console.log('user id:  ' + user.uid);
        const loggedUserRef = database().ref("users").child(user.uid); // get userData from database
        loggedUserRef.update({ isLoggedIn: true }); // set user as logged in    
        loggedUserRef.once("value", data => { 
          callback(data.val()); // wait for data from server and cache it
        });
      // user not logged in
      } else {
        resetUserData(userCachedData);
        // reload render
        this.setState({ onAuthFinished: true, userData: userCachedData }); // taki hack żeby poczekać na skończenie dziłania funkcji auth().onAuthStateChanged
      }
    });
  }

  render() {
    if (this.state.onAuthFinished === false) {
      return null;
    } else { 
      return (
        <Router>
          <Switch>

            <Route exact path="/" component={Home} />

            <UserRoute
              exact path="/play"
              isLoggedIn={this.state.userData.isLoggedIn}
              component={Play}
            />

            <GuestRoute
              exact path="/SignUp"
              isLoggedIn={this.state.userData.isLoggedIn}
              component={SignUp}
            />

            <GuestRoute
              exact path="/SignIn"
              isLoggedIn={this.state.userData.isLoggedIn}
              component={SignIn}
            />

          </Switch>
        </Router>
      );
    };
  };
};
