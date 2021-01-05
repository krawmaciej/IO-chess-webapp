import React from 'react';
import { Link } from "react-router-dom";

export default function NotSigned() {
    return (
        <div>
            <p>Not logged in</p>
            <Link to="/SignIn">Log in</Link>
            <p>or</p>
            <Link to="/SignUp">Create an account</Link>
        </div>
    );
}
