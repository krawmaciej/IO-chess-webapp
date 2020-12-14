import React from 'react';
import { auth } from '../firebase/firebase.js';
import { initChessPieces } from './chess.js';
import { initBoard, drawBoard, drawChessPieces } from './chessboard.js';
import './chessboard.css';

export default class Play extends React.Component {

  render() {
    return (
      <div class="board">
        <p>Logged in as {auth().currentUser.email}</p>
        <div id="chessBoard"> </div>
      </div>
    );
  }

  componentDidMount() {
    const chessPieces = initChessPieces();
    const chessBoard = initBoard(chessPieces);

    drawBoard();
    drawChessPieces(chessBoard);
  }
}
