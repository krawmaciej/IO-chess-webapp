import React from 'react';
import { auth } from '../firebase/firebase.js';
import { initChessPieces } from './chess.js';
import { initBoard, drawBoard, drawChessPieces } from './chessboard.js';
import './chessboard.css';
import './play.css';

export default class Play extends React.Component {

  render() {
    return (
      <div class="mainwindow">
        <p>Logged in as {auth().currentUser.email}</p>
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
