import React from 'react';
import { CHESS_COLORS, Chess } from '../../chess/chess.js';
import { drawBoard, drawChessPieces } from '../../chess/chessboard.js';
import { database } from '../../firebase/firebase';
import { userCachedData } from '../../user/userData';
import '../../chess/chessboard.css';
import './Play.css';

export default class Play extends React.Component {
  constructor() {
    super();    
    const chess = new Chess(userCachedData.color);
    this.state = {
      userRef: database().ref("users").child(userCachedData.uid),
      gameRef: database().ref("games").child(userCachedData.gameId), // reference to game in database
      game: {
        whitePlayerUid: "",
        blackPlayerUid: "",
        activePlayerColor: "",
        winner: "",   
        moves: []    
      },
      chess: chess
    };
  }

  render() {
    return (
      <div className="mainwindow">

        <div className="gameboard">
          <div id="chessBoard"> </div>
        </div>
        <div className="matchinfo" id="matchinfo">
          <p>Your color is {userCachedData.color}</p>
          <p>Now it's {this.state.game.activePlayerColor}'s turn.</p>
        </div>
        {/* <button onClick={() => { this.RESET() }}>CLEAR MOVES</button> */}
        <button onClick={() => { this.finishChessGame(
          userCachedData.color === CHESS_COLORS.BLACK ? CHESS_COLORS.WHITE : CHESS_COLORS.BLACK
          ) }}>Forfeit</button>
        {/* <button onClick={() => { console.log(this) }}>this</button> */}
      </div>
    );
  }

  RESET() {
    const movesRef = database().ref("games").child(userCachedData.gameId).child("moves");
    movesRef.set([]);
    this.state.gameRef.child('activePlayerColor').set(CHESS_COLORS.WHITE);
  }

  componentDidMount() {

    // at the beginning cache whole game data from server
    this.state.gameRef.once("value", data => {
      this.cacheGameData(data.val()); 
      drawChessPieces(this.state.game.activePlayerColor);
    });

    // 1) init board state and draw a board
    // 2) send [move] to db (CREATE MOVES FIRST)
    // 3) listen to changes on [moves]
    // 4) when changed, get new moves from db and update local board

    // 1) init board state and draw a board
    drawBoard(this.state.chess, this.sendData);

    // 3) listen to changes on Moves
    // listen to added moves, on start load each added move seperately (in order)
    this.state.gameRef.child("moves").on("child_added", data => {
      // 4) when changed, get new moves from db and update local board
      // console.log(data.val());
      this.loadMoves(data.val());
    });

    // listen to changes on activePlayerColor
    this.state.gameRef.child("activePlayerColor").on("value", data => {
      this.updatePageActivePlayerColor(data.val());
    });

    // listen to who won the game
    this.state.gameRef.child("winner").on("value", data => {
      if (data.val()) {
        this.closeGameOnDatabase(data.val());
        alert(`Game Over. ${data.val()} won the game!`);
        console.log("end", data.val());
        this.props.history.push('/')
      }
    });
    
  }
  
  cacheGameData(data) {
    const gameData = {
      whitePlayerUid: data.whitePlayerUid,
      blackPlayerUid: data.blackPlayerUid,
      activePlayerColor: data.activePlayerColor,
      winner: data.winner,
      moves: data.moves
    }
    this.setState({ game: gameData });
  }

  sendData = (move) => {
    // 2) send [move] to db
    const movesRef = database().ref("games").child(userCachedData.gameId).child("moves");
    movesRef.once("value", data => {
      let moves = data.val();
      if (!moves)
        moves = [];
      moves.push(move);
      movesRef.set(moves);
    }).then(() => {
      const newColor = CHESS_COLORS.WHITE === this.state.game.activePlayerColor ? CHESS_COLORS.BLACK : CHESS_COLORS.WHITE;
      this.state.gameRef.child('activePlayerColor').set(newColor);
    });
  }

  loadMoves = (move) => {
    //console.log("THIS -->", this);
    this.state.chess.makeMove(move);
    this.state.chess.calculateMoves();
    // checkmate
    drawChessPieces(this.state.game.activePlayerColor); 

    // console.log('is Game Over? -- ', this.state.game.activePlayerColor)
    if (this.state.chess.isGameOver()) {
      this.finishGame();
    }
  }

  updatePageActivePlayerColor(data) {
    const gameData = this.state.game;
    gameData.activePlayerColor = data;
    this.setState({ game: gameData });
    const container = document.getElementById("chessBoard");
    container.activePlayerColor = gameData.activePlayerColor;
  }    

  finishGame() {
    this.finishChessGame(this.state.chess.winner);
  }

  finishChessGame(winner) {
    this.state.gameRef.child('winner').once("value", data => {
      if (data.val() === "") { // check if someone already forfeited
        this.state.gameRef.child('winner').set(winner);
      }
    });
  }

  closeGameOnDatabase(winner) {
    this.updateWins(winner);
    this.state.userRef.child("color").set("");
    this.state.userRef.child("gameId").set("");
    userCachedData.totalGamesPlayed++;
    this.state.userRef.child("totalGamesPlayed").set(userCachedData.totalGamesPlayed);
  }

  updateWins(winner) {
    if (userCachedData.color === winner) {
      userCachedData.gamesWon++;
      this.state.userRef.child("gamesWon").set(userCachedData.gamesWon);
    }
  }

}


//GAME TIMER element not found, po wciśnięciu wstecz

// function gameTimer() {
//   var t = 15; //timer value in minutes

//   var msNow = new Date().getTime();
//   var msCountdownDate = new Date(msNow + t * 60 * 1000).getTime();

//   var x = setInterval(function () {
//     var now = new Date().getTime();

//     var delta = msCountdownDate - now; //remaining time

//     var minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60)); // 1h/1m
//     var seconds = Math.floor((delta % (1000 * 60)) / 1000); // 1m/1s

//     if (seconds < 10 && seconds >= 0) { seconds = "0" + seconds };

//     document.getElementById("timer").innerHTML = minutes + ":" + seconds;

//     if (delta < 0) {
//       clearInterval(x);
//       document.getElementById("timer").innerHTML = "<span style='color:red;'>Koniec czasu!</span>";
//       alert("Koniec czasu!"); //Start new game?
//     }

//   }, 1000);
// }
