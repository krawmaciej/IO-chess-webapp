import React from 'react';
import { Link } from "react-router-dom";

import './notsigned.css';

export default function NotSigned() {
    return (
        <div class="not-signed">
          <p class="welcome">Welcome to chess</p>
          <Link class="button" to="/SignIn">Log in</Link>
          <Link class="button" to="/SignUp">Create an account</Link>


        </div>
    );
}
