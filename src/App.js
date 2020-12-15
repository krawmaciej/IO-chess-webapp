// react
import React, { Component } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";

// components
import Home from './components/home'
import Login from './components/login'
import CreateAccount from './components/createAccount'
import Play from './components/play'
// firebase
import { auth, database } from './firebase/firebase'
// user
import { userCachedData, resetUserData, loadUserDataFromServer } from './user/userData.js';
// styles
import "./App.css";

// custom routes, like react route
function UserRoute({ component: Component, isLoggedIn, ...rest }) {
  return (
    <Route {...rest}
      render = {
        props => {
          if (isLoggedIn === true) {
            return (<Component {...props} />);
          } else {
            return (<Redirect to="/createAccount" />);
          }
        }
      }
    />
  );
}

function GuestRoute({ component: Component, isLoggedIn, ...rest }) {
  return (
    <Route {...rest}
      render = {
        props => {
          if (isLoggedIn === true) {
            return (<Redirect to="/" />);
          } else {
            return (<Component {...props} />);
          }
       }
      }
    />
  );
}


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      onAuthFinished: false,
      userData: userCachedData
    };
  }

  componentDidMount() {
    var callback = (data) => {
      loadUserDataFromServer(userCachedData, data);
      console.log("udatafirst: ", userCachedData);
      // reload render
      this.setState({ onAuthFinished: true, userData: userCachedData }); // taki hack żeby poczekać na skończenie dziłania funkcji auth().onAuthStateChanged
    }
    auth().onAuthStateChanged(user => {
      // user logged in
      if (user) {
        console.log(user.uid);
        var loggedUserRef = database().ref("users").child(user.uid); // get userData from database
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
              exact path="/createAccount"
              isLoggedIn={this.state.userData.isLoggedIn}
              component={CreateAccount}
            />
            <GuestRoute
              exact path="/login"
              isLoggedIn={this.state.userData.isLoggedIn}
              component={Login}
            />
          </Switch>
        </Router>
      );
    };
  };
};
