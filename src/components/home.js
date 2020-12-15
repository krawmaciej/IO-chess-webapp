import { Link, useHistory } from "react-router-dom";
import { userData } from '../user/userData';
import { chessColors } from '../chess/chess';
import { database } from '../firebase/firebase';

export default function Home() {
  var hello = null; // display page accordingly to user logged in state
  if (userData.isLoggedIn) {
    hello = (
      <div>
        <p>Logged in as {userData.email}</p>
        <p>uid is {userData.uid}</p> {/* TODO: uid for tests, remove later*/}
        <p>gid is {userData.gameId}</p> {/* TODO: gid for tests, remove later*/}
        <button onClick={playGame}>Play</button>
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

  const history = useHistory(); // react hooks
  function playGame() {
    if (userData.gameId === "") { // create new game
      createGame(history);
    } else { // player is already in a game
      goToGame(history);
    }
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

function createGame(history) {
  const colorIndex =  Math.floor(Math.random() * 2); // randomize player's color
    userData.color = chessColors[colorIndex]; // set player color
    
    const newGame = { // game state to be pushed into database
      player1: {
        uid: userData.uid,
        color: userData.color
      },
      player2: {
        uid: "",
        color: ""
      }
    };
  
    const game = database().ref("games").push();
    userData.gameId = game.key; // set user gid
  
    game.set(newGame).then(() => {
      history.push("/play");
    }, (err) => {
      throw err;
    });
}

function goToGame(history) {
  // check first if game exists in the database, if not throw error
  history.push("/play");
}
