import React from 'react';
import { initChessPieces, CHESS_COLORS } from '../chess/chess.js';
import { initBoard, drawBoard, drawChessPieces, movePieceWithoutChecking } from '../chess/chessboard.js';
import { database } from '../firebase/firebase';
import { userCachedData } from '../user/userData';
import '../chess/chessboard.css';
import './play.css';

export default class Play extends React.Component {
  constructor() {
    super();
    this.state = {
      gameRef: database().ref("games").child(userCachedData.gameId), // reference to game in database
      game: {
        whitePlayerUid: "",
        blackPlayerUid: "",
        activePlayerColor: "",
        winner: "",
        moves: []
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
    // gameRef.child("moves").once("value", data => { // get all moves made on the game and load from it current board state
    //   this.loadCurrentBoardState(data.val());
    // });

    // get whole game data from server, load from it current board state
    this.state.gameRef.once("value", data => {
      this.loadGameData(data.val()); 
    });

    // listen to changes of active player's color
    this.state.gameRef.child("activePlayerColor").on("value", data => {
      this.updatePageActivePlayerColor(data.val()); 
    });

    // listen to changes on moves, load every move including opponent's recent move
    this.state.gameRef.child("moves").on("value", data => {
      this.updateMoves(data.val());
    });

    const chessPieces = initChessPieces(); // get starting chess pieces positions
    const chessBoard = initBoard(chessPieces); // put pieces on board

    drawBoard(moveListener); // draw board and add listener to every piece/figure
    drawChessPieces(chessBoard); // draw added pieces on board

    // const doc = document.getElementById("6_6");
    // console.log(doc);
  }

  loadGameData(data) {
    const gameData = {
      whitePlayerUid: data.whitePlayerUid,
      blackPlayerUid: data.blackPlayerUid,
      activePlayerColor: data.activePlayerColor,
      winner: data.winner,
      moves: data.moves
    }
    this.loadCurrentBoardState(gameData.moves);
    this.setState({ game: gameData });
    console.log("Game: ", this.state.game);
  }

  // load board state by replaying moves
  loadCurrentBoardState(data) {
    if (!data) {
      return;
    }
    const movesSkipLastMove = data.slice(0, data.length - 1);
    movesSkipLastMove.forEach( (element) => { // replay every move made until now (load current board state)
      const move = this.prepareMove(element); // get move tiles
      movePieceWithoutChecking(move);
    });
  }

  prepareMove(move) {
    return {
      from: document.getElementById(move.from),
      to: document.getElementById(move.to)
    };
  }

  updatePageActivePlayerColor(data) {
    //console.log("data only active color: ", data);
    var gameData = this.state.game;
    gameData.activePlayerColor = data;
    this.setState({ game: gameData });
  }

  updateMoves(data) {
    this.updateStateWithMoves(data);
    if (!data) {
      return;
    }
    const mostRecentMove = data[data.length - 1];

    // const thisPlayerMadeLastMove = mostRecentMove.color === userCachedData.color;
    // if (thisPlayerMadeLastMove) {
    //   return;
    // }
    // load last move
    const move = this.prepareMove(mostRecentMove); // get move tiles
    movePieceWithoutChecking(move);
  }

  updateStateWithMoves(moves) {
    var gameData = this.state.game;
    gameData.moves = moves;
    this.setState({ game: gameData });
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

// send heard move to database by appending it to db's moves array
const moveListener = function(move) {
  move.color = userCachedData.color; // player color who made the move
  var movesRef = database().ref("games").child(userCachedData.gameId).child("moves");
  // load moves from server to append them with new move
  movesRef.once("value", function(data) {
    addNewMoveToMovesOnServer(data.val(), move, movesRef); // pass moves, new move and db reference
  });

  console.log("listened move: ", move);
  //console.log("moves array", moves);
}

const addNewMoveToMovesOnServer = function(moves, move, movesRef) {
  if (!moves) {
    moves = [];
  }
  moves.push(move);
  movesRef.set(moves);
  // after move has been made, set active player to opponent
  var activeColorRef = database().ref("games").child(userCachedData.gameId).child("activePlayerColor");
  const isCurrentUserWhite = userCachedData.color === CHESS_COLORS.WHITE;
  const opponentColor = isCurrentUserWhite ? CHESS_COLORS.BLACK : CHESS_COLORS.WHITE;
  activeColorRef.set(opponentColor); // change active player color on server
}