// REACT and FIREBASE
import React from "react";
import { useHistory } from "react-router-dom";
import { auth } from '../../firebase/firebase';

// USER INFO
import { userCachedData, isPlayerInGame } from '../../user/userData';

// GAME TYPES (ranked, wait for someone to join your quick game, invite other user to game)
import { WaitForPlayerToJoin } from './WaysToStartGame/WaitForPlayerToJoin';

// USERLIST
import ActiveUsers from "./ActiveUsers/ActiveUsers";

export default function Signed() {

    const history = useHistory();
    
    // those functions are inside Signed() because they use react hook history
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
          {renderPlayGamesMenu()}
          <button onClick={SignOut}>Logout</button>
          
          <table>
            
            <tbody>
              <ActiveUsers />
            </tbody>
          </table>
        </div>
    );
}

function SignOut() {
  auth().signOut().then(() => {
    console.log('successful signout');
    // Sign-out successful.
  }).catch(console.log)
}
