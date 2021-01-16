// REACT and FIREBASE
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, invitesRef } from '../../firebase/firebase';

// USER INFO
import { userCachedData, isPlayerInGame } from '../../user/userData';

// GAME TYPES (ranked, wait for someone to join your quick game, invite other user to game)
import { WaitForPlayerToJoin } from './WaysToStartGame/WaitForPlayerToJoin';

// USERLIST
import ActiveUsers from "./ActiveUsers/ActiveUsers";
import { invite } from "./InvitePopup";

export default function Signed() {
  const [isInviteSent, setIsInviteSent] = useState(false); // TODO: take this from database instead hint: react setstate once
  const [inviteDbKey, setInviteDbKey] = useState("");
  const history = useHistory();
  

  useEffect(() => {
    // TODO: change to non automatic
    // if invite is sent to this player then show it on screen
    // automaticly accepts invite for now
    invitesRef.on('value', data => {
      data.forEach((entry) => {
        if (isThisUserInvited(entry.val())) {
          showInvite(entry.key);
        }
      });
    });
  }, []);


  function isThisUserInvited(entry) {
    console.log(entry);
    return (entry.joiner === userCachedData.uid) ? true : false;
  }
    
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
                null
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

    function acceptInvite(key) {
      invitesRef.child(key).child("isAccepted").set(true).then(() => {
        invitesRef.child(key).child("isGameStarted").on('value', data => {
          if (data.val()) { // game was created then join
            invitesRef.child(key).child("isGameStarted").off(); // remove listener
            //setHasActiveUserSentInvite(false); // close popup
            invitesRef.child(key).remove(); // remove invite
            goToGame();
          }
        });
      });
    }

    function cancelInvite() {
      console.log("canceled invite!");
    }



    function showInvite(key) {
      setIsInviteSent(true);
      setInviteDbKey(key);
    }

    return (
        <div>
          {invite(isInviteSent, setIsInviteSent, inviteDbKey, acceptInvite, cancelInvite)}

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
