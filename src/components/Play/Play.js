import React from 'react';
import { CHESS_COLORS } from '../../chess/chess.js';
import { initBoard, drawBoard, drawChessPieces, makeMove} from '../../chess/chessboard.js';
import { database } from '../../firebase/firebase';
import { userCachedData } from '../../user/userData';
import '../../chess/chessboard.css';
import './Play.css';

export default class Play extends React.Component {
  constructor() {
    super();    
    const chessBoard = initBoard(); // put pieces on board
    gameTimer();
    this.state = {
      gameRef: database().ref("games").child(userCachedData.gameId), // reference to game in database
      game: {
        whitePlayerUid: "",
        blackPlayerUid: "",
        activePlayerColor: "",
        winner: "",   
        moves: []    
      },
      board: chessBoard,
      props: {
        activePlayerColor: "",
        thisPlayerColor: userCachedData.color,
      }
    };
  }

  render() {
    return (
      <div className="mainwindow">
        <p>Logged in as {userCachedData.email}</p>
        <p>uid is {userCachedData.uid}</p> {/* TODO: uid for tests, remove later*/}
        <p>gid is {userCachedData.gameId}</p> {/* TODO: gid for tests, remove later*/}

        <div className="gameboard">
          <div id="chessBoard"> </div>
        </div>
        <div className="matchinfo" id="matchinfo">
          <p>Your color is {userCachedData.color}</p>
          <p>Now it's {this.state.game.activePlayerColor}'s turn.</p>
          <p>Pozostały czas: <span id="timer">-:-</span></p>
        </div>
        <button onClick={() => { this.RESET() }}>CLEAR MOVES</button>
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
    });

    // 1) init board state and draw a board
    // 2) send [move] to db (CREATE MOVES FIRST)
    // 3) listen to changes on [moves]
    // 4) when changed, get new moves from db and update local board

    // 1) init board state and draw a board
    drawBoard(this.state.board, this.sendData);  
    drawChessPieces(this.state.board, this.state.props);


    // 3) listen to changes on Moves
    // listen to added moves, on start load each added move seperately (in order)
    this.state.gameRef.child("moves").on("child_added", data => {
      // 4) when changed, get new moves from db and update local board
      console.log(data.val());
      this.loadMoves(data.val());
    });

    // listen to changes on activePlayerColor
    this.state.gameRef.child("activePlayerColor").on("value", data => {
      this.updatePageActivePlayerColor(data.val());
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

    const propsData = this.state.props;
    propsData.activePlayerColor = this.state.game.activePlayerColor;
    this.setState({ props: propsData });
    // console.log("current state: ", this.state.game);
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
    makeMove(this.state.board, move);
    drawChessPieces(this.state.board, this.state.props);
  }

  updatePageActivePlayerColor(data) {
    const gameData = this.state.game;
    gameData.activePlayerColor = data;
    this.setState({ game: gameData });

    const propsData = this.state.props;
    propsData.activePlayerColor = this.state.game.activePlayerColor;
    this.setState({ props: propsData });
  }    
}



//GAME TIMER

function gameTimer() {
  var t = 15; //timer value in minutes

  var msNow = new Date().getTime();
  var msCountdownDate = new Date(msNow + t * 60 * 1000).getTime();

  var x = setInterval(function () {
    var now = new Date().getTime();

    var delta = msCountdownDate - now; //remaining time

    var minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60)); // 1h/1m
    var seconds = Math.floor((delta % (1000 * 60)) / 1000); // 1m/1s

    if (seconds < 10 && seconds >= 0) { seconds = "0" + seconds };

    document.getElementById("timer").innerHTML = minutes + ":" + seconds;

    if (delta < 0) {
      clearInterval(x);
      document.getElementById("timer").innerHTML = "<span style='color:red;'>Koniec czasu!</span>";
      alert("Koniec czasu!"); //Start new game?
    }

  }, 1000);
}
