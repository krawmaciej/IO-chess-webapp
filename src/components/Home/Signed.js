import React from "react";
import { useHistory } from "react-router-dom";

import { CHESS_COLORS } from '../../chess/chess';
import { auth, database } from '../../firebase/firebase';
import { userCachedData, isPlayerInGame } from '../../user/userData';
import { WaitForPlayerToJoin } from './WaysToStartGame/WaitForPlayerToJoin';

export default function Signed() {
    const history = useHistory();
      
    function createGame(goToGameCallback) {
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
            goToGameCallback();
        }, (err) => {
            throw err;
        });
    }

    function renderPlayGamesMenu() {
        if (isPlayerInGame()) {
            return (
                <div>
                    <p>You're already in the game</p>
                    <button onClick={goToGame}>Join your game</button>
                </div>
            );
        } else {
            return (
                <div>
                    <p>Start a simple game and wait for other player to join</p>
                    <button onClick={waitForPlayerToJoinButton}>Play</button>
                </div>
            );
        }
    }

    function goToGame() {
        // TODO: check first if game exists in the database, if not throw error
        history.push("/play");
    }

    function waitForPlayerToJoinButton() {
        // put either history or gotogame function as a callback, so that play is only rendered after game was created
        WaitForPlayerToJoin(goToGame); // invokes a game type creation function that the user clicked on
    }

    return (
        <div>
            <p>Logged in as {userCachedData.email}</p>
            <p>uid is {userCachedData.uid}</p> {/* TODO: uid for tests, remove later*/}
            <p>gid is {userCachedData.gameId}</p> {/* TODO: gid for tests, remove later*/}
            <p>TODO: display possible game modes if player's not in the game
            OTHERWISE display only the play button to let player join the game that he's in</p>
            {renderPlayGamesMenu()}
            <button onClick={SignOut}>Logout</button>
        </div>
    );
}

function SignOut() {
    auth().signOut().then(() => {
      console.log('successful signout');
      // Sign-out successful.
    }).catch(console.log)
}
