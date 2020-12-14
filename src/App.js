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
      isLoggedIn: false,
      uid: "",
      gameId: "",
      onAuthFinished: false // taki hack żeby poczekać na skończenie dziłania funkcji auth().onAuthStateChanged
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          isLoggedIn: true,
          uid: user.uid,
          onAuthFinished: true
        });
      } else {
        this.setState({
          isLoggedIn: false,
          uid: "",
          onAuthFinished: true
        });
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
              isLoggedIn={this.state.isLoggedIn}
              component={Play}
            />
            <GuestRoute
              exact path="/createAccount"
              isLoggedIn={this.state.isLoggedIn}
              component={CreateAccount}
            />
            <GuestRoute
              exact path="/login"
              isLoggedIn={this.state.isLoggedIn}
              component={Login}
            />
          </Switch>
        </Router>
      );
    };
  };
};
