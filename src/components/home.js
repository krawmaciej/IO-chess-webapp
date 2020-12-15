import { Link, useHistory } from "react-router-dom";
import { userCachedData } from '../user/userData';
import { CHESS_COLORS } from '../chess/chess';
import { database } from '../firebase/firebase';

export default function Home() {
  var hello = null; // display page accordingly to user logged in state
  if (userCachedData.isLoggedIn) {
    hello = (
      <div>
        <p>Logged in as {userCachedData.email}</p>
        <p>uid is {userCachedData.uid}</p> {/* TODO: uid for tests, remove later*/}
        <p>gid is {userCachedData.gameId}</p> {/* TODO: gid for tests, remove later*/}
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
    if (userCachedData.gameId === "") { // create new game
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
  const newGame = { // game state to be pushed into database
    whitePlayerUid: "",
    blackPlayerUid: "",
    activePlayerColor: CHESS_COLORS.WHITE,
    winner: ""
  };

  const colorIndex =  Math.floor(Math.random() * 2); // randomize player's color

  if (colorIndex === CHESS_COLORS.WHITE) {
    newGame.whitePlayerUid = userCachedData.uid; // make player a white player
    userCachedData.color = CHESS_COLORS.WHITE; // set player color to white
  } else {
    newGame.blackPlayerUid = userCachedData.uid; // make player a black player
    userCachedData.color = CHESS_COLORS.BLACK; // set player color to black
  }

  const gameRef = database().ref("games").push();
  userCachedData.gameId = gameRef.key; // set user gid

  const loggedUserRef = database().ref("users").child(userCachedData.uid);
  loggedUserRef.set(userCachedData); // update user data on database

  gameRef.set(newGame).then(() => {
    history.push("/play");
  }, (err) => {
    throw err;
  });
}

function goToGame(history) {
  // check first if game exists in the database, if not throw error
  history.push("/play");
}
