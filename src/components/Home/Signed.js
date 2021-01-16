// REACT and FIREBASE
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, invitesRef } from '../../firebase/firebase';

// USER INFO
import { userCachedData, isPlayerInGame, getUsername } from '../../user/userData';

// USERLIST
import ActiveUsers from "./ActiveUsers/ActiveUsers";
import { invite } from "./InvitePopup";

export default function Signed() {
  const [isInviteSent, setIsInviteSent] = useState(false);
  const [inviteDbKey, setInviteDbKey] = useState("");
  const [invitorUsername, setInvitorUsername] = useState("");
  const history = useHistory();
  

  // works only once at the component did mount phase
  useEffect(() => {
    invitesRef.on('value', data => {
      data.forEach((entry) => {
        if (isUserInvited(entry.val(), userCachedData.uid)) {
          showInvite(entry);
        }
      });
    });
  }, []);


  function isUserInvited(entry, userId) {
    return (entry.joiner === userId) ? true : false;
  }

  function isUserInvitor(entry, userId) {
    return (entry.creator === userId) ? true : false;
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

    function cleanupBothPlayersExistingInvites(key) {
      invitesRef.child(key).once("value", data => {
        removeAllInvites(data.val().creator);
        removeAllInvites(data.val().joiner);
      });
    }

    function removeAllInvites(userId) {
      invitesRef.once('value', data => {
        data.forEach((entry) => {
          if (isUserInvited(entry.val(), userId) || isUserInvitor(entry.val(), userId)) {
            invitesRef.child(entry.key).remove();
          }
        });
      });
    }

    function goToGame() {
        history.push("/play");
    }

    function acceptInvite(key) {
      invitesRef.child(key).child("isAccepted").set(true).then(() => {
        invitesRef.child(key).child("isGameStarted").on('value', data => {
          if (data.val()) { // game was created then join
            invitesRef.child(key).child("isGameStarted").off(); // remove listener
            
            // take care of both players invites
            cleanupBothPlayersExistingInvites(key);

            goToGame();
          }
        });
      });
    }

    function cancelInvite(key) {
      invitesRef.child(key).child("isCancelled").set(true);
    }

    function showInvite(entry) {
      setInvitorUsername(entry.val().creatorName);
      setInviteDbKey(entry.key);
      setIsInviteSent(true);
    }

    return (
        <div>
          {invite(isInviteSent, setIsInviteSent, invitorUsername, inviteDbKey, acceptInvite, cancelInvite)}
          <button onClick={SignOut}>Logout</button>
          <p>Hi! {getUsername(userCachedData.email)}</p>
          {renderPlayGamesMenu()}
          
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Games Won</th>
                <th>Games Lost</th>
                <th>Total</th>
                <th>Winratio</th>
                <th>Status</th>
                <th>Invite</th>
              </tr>
            </thead>
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