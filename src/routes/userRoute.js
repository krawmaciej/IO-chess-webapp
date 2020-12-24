// react
import React from 'react';
import {
  Route,
  Redirect
} from "react-router-dom";

export default function UserRoute({ component: Component, isLoggedIn, ...rest }) {
  return (
    <Route {...rest}
      render = {
        props => {
          if (isLoggedIn === true) {
            return (<Component {...props} />);
          } else {
            return (<Redirect to="/SignUp" />);
          }
        }
      }
    />
  );
}