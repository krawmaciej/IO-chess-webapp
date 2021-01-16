// REACT and FIREBASE
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, invitesRef } from '../../firebase/firebase';

// USER INFO
import { userCachedData, isPlayerInGame } from '../../user/userData';

// USERLIST
import ActiveUsers from "./ActiveUsers/ActiveUsers";
import { invite } from "./InvitePopup";

export default function Signed() {
  const [isInviteSent, setIsInviteSent] = useState(false);
  const [inviteDbKey, setInviteDbKey] = useState("");
  const history = useHistory();
  

  // works only once at the component did mount phase
  useEffect(() => {
    invitesRef.on('value', data => {
      data.forEach((entry) => {
        if (isThisUserInvited(entry.val())) {
          showInvite(entry.key);
        }
      });
    });
  }, []);


  function isThisUserInvited(entry) {
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

    function cancelInvite(key) {
      invitesRef.child(key).child("isCancelled").set(true);
    }

    function showInvite(key) {
      setInviteDbKey(key);
      setIsInviteSent(true);
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
