import React from "react";
import { useHistory } from "react-router-dom";

export default function UserRow(props) {
  const history = useHistory();

  function goToGame() {
    // TODO: check first if game exists in the database, if not throw error
    history.push("/play");
  }

  return (
    <tr>
      <td>{props.email}</td>
      <td>{isPlayingMessage(props.gameId)}</td>
      <td>{playTogetherButton(props.gameId, goToGame)}</td>
    </tr>
  )
}

function isInGame(gameId) {
  return (gameId === "") ? false : true;
}

function isPlayingMessage(gameId) {

  if (isInGame(gameId)) {
    return (
      <div>
        in game
      </div>
    );
  }

  return (
    <div>
      not in game
    </div>
  );

}

function playTogetherButton(gameId, goToGameCallback) {
    if (isInGame(gameId)) {
      return <button onClick={() => joinGameButton(gameId, goToGameCallback)}>Join the game</button>;
    } else {
      return null;
    }
}

function joinGameButton(gameId, goToGameCallback) {

}