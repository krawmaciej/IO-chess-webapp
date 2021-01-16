import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { auth, database } from "../../firebase/firebase";

// userData
import { userCachedData } from '../../user/userData';

export default class SignUp extends Component {

  constructor() {
    super();
    this.state = {
      error: null,
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: "" });

    auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((user) => { // signed up and in correctly
      //console.log("uregi: ", user.user.uid);
      var userData = user.user;
      // prepare cached data to be inserted
      userCachedData.uid = userData.uid;
      userCachedData.email = userData.email;
      userCachedData.isLoggedIn = true;

      var usersRef = database().ref("users"); // get db connection to /users
      usersRef.child(userData.uid).set(userCachedData); // put cached data into database
    })
    .catch((error) => { // couldn't sign up
      this.setState({ error: error.message });
    });
  }

  render() {
    return (
      <div className="container">
        <form className="mt-5 py-5 px-5" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input 
              className="form-control"
              placeholder="email"
              name="email" type="email"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="password"
              name="password"
              type="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </div>
          <div className="form-group"> {
              this.state.error ? <p className="text-danger">{this.state.error}</p> : null
            }
            <button className="btn btn-primary px-5" type="submit">Sign up!</button>
          </div>
          <p>
            <Link to="/SignIn">Log in!</Link>
          </p>
        </form>
      </div>
    )
  }
}
