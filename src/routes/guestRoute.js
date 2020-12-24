// react
import React from 'react';
import {
  Route,
  Redirect
} from "react-router-dom";


export default function GuestRoute({ component: Component, isLoggedIn, ...rest }) {
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