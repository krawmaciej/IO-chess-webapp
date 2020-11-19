// react
import React, { Component } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
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

export default function App() {
  return (
    <Router>
      <div>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/play">
          <Play />    
        </Route>      
      </div>
      <div>
        <nav>     
         <Link to="/play">Play!</Link>
        </nav>       
      </div>
    </Router>
  );
}
