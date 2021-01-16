import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Popup from "reactjs-popup";
import { database } from "../../../firebase/firebase";
import { isPlayerInGame, userCachedData } from "../../../user/userData";
import { CreateGameForTwoPlayers } from "../WaysToStartGame/CreateGameForTwoPlayers";
import './invite.css';

const inviteSent = (hasActiveUserSentInvite) => (
  <Popup
    open={hasActiveUserSentInvite}
    modal
  >
    {close => (
      <div className="inviteSent">
        <div className="header">
          {' '}
          Invite sent!
        </div>
        <div className="actions">
          <button className="button" onClick={close}>
            OK
          </button>
        </div>
      </div>
    )}
  </Popup>
);



export default function UserRow(props) {
  const history = useHistory();
  const [hasActiveUserSentInvite, setHasActiveUserSentInvite] = useState(false); // TODO: take this from database instead

  function goToGame() {
    // TODO: check first if game exists in the database, if not throw error
    history.push("/play");
  }

  return (
    <tr>
      {inviteSent(hasActiveUserSentInvite)}
      <td>{props.email}</td>
      <td>{isPlayingMessage(props.gameId)}</td>
      <td>{sendInviteToGame(props, hasActiveUserSentInvite, setHasActiveUserSentInvite, goToGame)}</td>
    </tr>
  )
}

function isNotInGame(gameId) {
  return (gameId === "") ? true : false;
}

function isPlayingMessage(gameId) {

  if (isNotInGame(gameId)) {
    return (
      <div>
        not in game
      </div>
    );
  }

  return (
    <div>
      in game
    </div>
  );

}

function sendInviteToGame(user, hasActiveUserSentInvite, setHasActiveUserSentInvite, goToGame) {
  // check also on if active user sent invite
    if (isNotInGame(user.gameId) && !hasActiveUserSentInvite && !isPlayerInGame()) {
      return <button onClick={() => sendGameInvite(user.uid, setHasActiveUserSentInvite, goToGame)}>Send invite</button>;
    } else {
      return null;
    }
}

function sendGameInvite(enemyId, setHasActiveUserSentInvite, goToGame) {
  const inviteRef = database().ref("invites").push();
  setHasActiveUserSentInvite(true); // active(this) user sent an invite

  const invite = {
    creator: userCachedData.uid,
    joiner: enemyId,
    isAccepted: false,
    isCancelled: false,
    isGameStarted: false,
  }

  inviteRef.set(invite).then(() => {
    // const myInviteRef = database().ref("invites").child(inviteKey).child("isAccepted");
    inviteRef.child("isAccepted").on('value', data => {
      console.log(data.val());
      if (data.val()) { // was accepted
        inviteRef.child("isAccepted").off(); // remove listener
        inviteRef.child("isCancelled").off(); // remove listener
        setHasActiveUserSentInvite(false);
        CreateGameForTwoPlayers(enemyId, goToGame, () => inviteRef.child("isGameStarted").set(true));
        // make invite inactive
      }
    });

    inviteRef.child("isCancelled").on('value', data => {
      if (data.val()) { // was cancelled
        inviteRef.child("isAccepted").off(); // remove listener
        inviteRef.child("isCancelled").off(); // remove listener
        setHasActiveUserSentInvite(false);
        removeInvite(inviteRef);
        // make invite inactive
      }
    });

    
  }, (err) => {
      throw err;
  });
}

function removeInvite(inviteRef) {
  inviteRef.remove();
}