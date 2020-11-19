import { Link } from "react-router-dom";
import { auth } from '../firebase/firebase';

export default function Home() {
  var hello = null;
  if (auth().currentUser) {
    hello = (
      <div>
        <p>Logged in as {auth().currentUser.email}</p>
        <Link to="/play">Play!</Link>
      </div>
    );
  } else {
    hello = (
      <div>
        <p>Not logged in</p>
        <Link to="/createAccount">Create an account</Link>
        <p>or</p>
        <Link to="/login">Log in</Link>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Home</h1>
        {hello}
      </div>
    </div>
  );
}
