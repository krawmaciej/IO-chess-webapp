import React from 'react';
import { initChessPieces, CHESS_COLORS } from '../chess/chess.js';
import { initBoard, drawBoard, drawChessPieces } from '../chess/chessboard.js';
import { database } from '../firebase/firebase';
import { userCachedData } from '../user/userData';
import '../chess/chessboard.css';
import './play.css';

export default class Play extends React.Component {
  constructor() {
    super();
    this.state = {
      game: {
        whitePlayerUid: "",
        blackPlayerUid: "",
        activePlayerColor: "",
        winner: ""
      }
    };
  }

  render() {
    return (
      <div class="mainwindow">
        <p>Logged in as {userCachedData.email}</p>
        <p>uid is {userCachedData.uid}</p> {/* TODO: uid for tests, remove later*/}
        <p>gid is {userCachedData.gameId}</p> {/* TODO: gid for tests, remove later*/}
        <div class="gameboard">
          <div id="chessBoard"> </div>
        </div>
        <div class="matchinfo" id="matchinfo">
          <p>Your color is {this.colorToText(userCachedData.color)}</p>
          <p>Now it's {this.colorToText(this.state.game.activePlayerColor)}'s turn.</p>
        </div>
      </div>
    );
  }

  componentDidMount() {
    var gameRef = database().ref("games").child(userCachedData.gameId); // get game from database
    gameRef.on("value", data => {
      this.updateState(data.val()); // listen to changes on server, then update state accordingly
    });

    const chessPieces = initChessPieces(); // get starting chess pieces positions
    const chessBoard = initBoard(chessPieces); // put pieces on board

    drawBoard();
    drawChessPieces(chessBoard); // draw added pieces on board
  }

  updateState(data) {
    const gameData = {
      whitePlayerUid: data.whitePlayerUid,
      blackPlayerUid: data.blackPlayerUid,
      activePlayerColor: data.activePlayerColor,
      winner: data.winner
    }
    this.setState({ game: gameData });
    console.log("Game: ", this.state.game);
  }

  colorToText(color) {
    if (color === CHESS_COLORS.WHITE) {
      return "White";
    }
    if (color === CHESS_COLORS.BLACK) {
      return "Black";
    }
    return "";
  }
}


