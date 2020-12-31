import React from 'react';
import { CHESS_COLORS } from '../../chess/chess.js';
import { initBoard, drawBoard, drawChessPieces} from '../../chess/chessboard.js';
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
      </div>
    );
  }

  componentDidMount() {

    // at the beginning cache whole game data from server
    this.state.gameRef.once("value", data => {
      this.cacheGameData(data.val()); 
      drawChessPieces(this.state.board, this.state.props); 
    });

    // 1) init board state and draw a board
    // 2) create boardToSend and send it to db
    // 3) listen to changes on board state
    // 4) when changed, receive data from db and update local board state and  run drawChessPieces

    // draw a board send board state to db  
    drawBoard(this.state.board, this.sendData);  
    this.sendData();

    // listen to changes on boardState
    this.state.gameRef.child('boardState').on('value', data => {
      this.updateBoardState(data.val());
      drawChessPieces(this.state.board, this.state.props); 
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
      winner: data.winner
    }
    this.setState({ game: gameData });

    const propsData = this.state.props;
    propsData.activePlayerColor = this.state.game.activePlayerColor;
    this.setState({ props: propsData });
    // console.log("current state: ", this.state.game);
  }
  /* const gameData = this.state.game;
  gameData.activePlayerColor = CHESS_COLORS.WHITE === this.state.game.activePlayerColor ? CHESS_COLORS.BLACK : CHESS_COLORS.WHITE;
  this.setState({ game: gameData }); */
  sendData = () => {
    // send updated data to db
    const newColor = CHESS_COLORS.WHITE === this.state.game.activePlayerColor ? CHESS_COLORS.BLACK : CHESS_COLORS.WHITE;
    this.state.gameRef.child('activePlayerColor').set(newColor);

    //  send chess board state to a DB
    const arrToSend = stringifyChessBoard(this.state.board);
    //console.log('board to send: ', arrToSend)
    this.state.gameRef.child('boardState').set(arrToSend);
  }

  updateBoardState(data) {
    const board = this.state.board;
    //console.log('data from db: ', data);
    //console.log('board to update: ', board); /**/
    updateArray(data, board);
    this.setState({ board: board });      
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

const stringifyChessBoard = (board) => {
  let arrToSend = [];
  for (let i = 0; i < 8; i++)
    arrToSend[i] = [];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const id = board[i][j].id;
      arrToSend[i][j] = id ? id : false;
    }
  }
  return arrToSend;
} 

const updateArray = (arrFromDb, arrToUpdate) => {
  const changedPositions = [];

  for (let i = 0; i < arrToUpdate.length; i++) {
    for (let j = 0; j < arrToUpdate[i].length; j++) {
      if (arrToUpdate[i][j] && arrToUpdate[i][j].id !== arrFromDb[i][j])
        changedPositions.push(arrToUpdate[i][j]);
    }    
  }

  changedPositions.forEach(obj => {
    let destinationIndexX, destinationIndexY;
    let currentIndexX = obj.posX, 
        currentIndexY = obj.posY;

    for (let i = 0; i < arrFromDb.length; i++) {
      for (let j = 0; j < arrFromDb[i].length; j++) {
        if (arrFromDb[i][j] === obj.id) {
          destinationIndexX = i;
          destinationIndexY = j;
        }
      }
    }

    arrToUpdate[currentIndexX][currentIndexY] = false;
    if (typeof(destinationIndexX) === 'number' && typeof(destinationIndexY) === 'number') {   
      obj.setPositions(destinationIndexX, destinationIndexY);
      arrToUpdate[destinationIndexX][destinationIndexY] = obj;
    }

  });
};

/*
  updatePageActivePlayerColor(data) {
    const gameData = this.state.game;
    gameData.activePlayerColor = data;
    this.setState({ game: gameData });
  }     */

/*   cacheGameData(data) {
    const gameData = {
      whitePlayerUid: data.whitePlayerUid,
      blackPlayerUid: data.blackPlayerUid,
      activePlayerColor: data.activePlayerColor,
      winner: data.winner,
      boardState: []
    }
    this.setState({ game: gameData });
    console.log("caching game data: ", this.state.game);
  } */

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
