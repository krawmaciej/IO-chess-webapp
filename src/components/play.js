import React from 'react';
import { initChessPieces } from '../chess/chess.js';
import { initBoard, drawBoard, drawChessPieces } from '../chess/chessboard.js';
import { userCachedData } from '../user/userData';
import '../chess/chessboard.css';
import './play.css';

export default class Play extends React.Component {

  render() {
    return (
      <div class="mainwindow">
        <p>Logged in as {userCachedData.email}</p>
        <p>uid is {userCachedData.uid}</p> {/* TODO: uid for tests, remove later*/}
        <p>gid is {userCachedData.gameId}</p> {/* TODO: gid for tests, remove later*/}
        <div class="gameboard">
          <div id="chessBoard"> </div>
        </div>
        <div class="matchinfo" id="matchinfo">White turn</div>
      </div>
    );
  }

  componentDidMount() {
    const chessPieces = initChessPieces(); // get starting chess pieces positions
    const chessBoard = initBoard(chessPieces); // put pieces on board

    drawBoard();
    drawChessPieces(chessBoard); // draw added pieces on board
  }
}
