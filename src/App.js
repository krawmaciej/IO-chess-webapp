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
import { auth } from './firebase/firebase'
// user
import { userData, resetUserData } from './user/userData.js';
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
    this.state = { userData };
  }

  componentDidMount() {
    console.log("udatafirst: ", userData);
    auth().onAuthStateChanged(user => {
      if (user) {
        userData.isLoggedIn = true;
        userData.uid = user.uid;
        userData.email = user.email;
      } else {
        resetUserData(userData);
      }
      userData.onAuthFinished = true; // taki hack żeby poczekać na skończenie dziłania funkcji auth().onAuthStateChanged
      this.setState({ userData }); // refresh render
    });
  }

  render() {
    if (this.state.userData.onAuthFinished === false) {
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
