import React from "react";
import { useHistory } from "react-router-dom";

import { CHESS_COLORS } from '../../chess/chess';
import { auth, database } from '../../firebase/firebase';
import { userCachedData } from '../../user/userData';

export default function Signed() {
    const history = useHistory();

    function SignOut() {
        auth().signOut().then(() => {
          console.log('successful signout');
          // Sign-out successful.
        }).catch(console.log)
    }

    function playGame() {
        if (userCachedData.gameId === "") { // create new game
          //console.log("history: ", this.props.history);
          // console.log("props: ", this.props);
          createGame();
        } else { // player is already in a game
          goToGame()
        }
      }
      
      function createGame() {
          const newGame = { // game state to be pushed into database
              whitePlayerUid: "",
              blackPlayerUid: "",
              activePlayerColor: CHESS_COLORS.WHITE,
              winner: "",
              moves: [] // array of moves made by each player, also used to load current state of the board
          };
      
          newGame.whitePlayerUid = userCachedData.uid; // make player a white player
          userCachedData.color = CHESS_COLORS.WHITE; // set player color to white
      
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
        
      function goToGame() {
          // TODO: check first if game exists in the database, if not throw error
          history.push("/play");
      }

    return (
        <div>
            <p>Logged in as {userCachedData.email}</p>
            <p>uid is {userCachedData.uid}</p> {/* TODO: uid for tests, remove later*/}
            <p>gid is {userCachedData.gameId}</p> {/* TODO: gid for tests, remove later*/}
            <button onClick={playGame}>Play</button>
            <button onClick={SignOut}>Wyloguj</button>
        </div>
    );
}
