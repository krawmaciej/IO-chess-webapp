import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";
import { auth } from './firebase/firebase'
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

function Home() {
  return <h2>Home</h2>;
}

function Play() {
  return <h2>Chessboard.</h2>;
}