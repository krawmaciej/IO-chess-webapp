import React from 'react';
import { initChessPieces, CHESS_COLORS } from '../../chess/chess-old.js';
import { initBoard, drawBoard, drawChessPieces, /* movePieceWithoutChecking */ } from '../../chess/chessboard-old.js';
import { database } from '../../firebase/firebase';
import { userCachedData } from '../../user/userData';
import '../../chess/chessboard.css';
import './Play.css';

export default class Play extends React.Component {
  constructor() {
    super();
    const chessPieces = initChessPieces(); // get starting chess pieces positions
    const chessBoard = initBoard(chessPieces); // put pieces on board
    this.state = {
      gameRef: database().ref("games").child(userCachedData.gameId), // reference to game in database
      game: {
        whitePlayerUid: "",
        blackPlayerUid: "",
        activePlayerColor: "",
        winner: "",
        moves: [] // this is not used right now, but might be needed later, just caching data from server
      },      
      board: chessBoard
    };
  }

  render() {
    return (
      <div className="mainwindow">
        <p>Logged in as {userCachedData.email}</p>
        <p>uid is {userCachedData.uid}</p> {/* TODO: uid for tests, remove later*/}
        <p>gid is {userCachedData.gameId}</p> {/* TODO: gid for tests, remove later*/}

        <button onClick={() => { resetMoves(this.state.board) }}>Reset</button>

        <div className="gameboard">
          <div id="chessBoard"> </div>
        </div>
        <div className="matchinfo" id="matchinfo">
          <p>Your color is {userCachedData.color}</p>
          <p>Now it's {this.state.game.activePlayerColor}'s turn.</p>
        </div>
      </div>
    );
  }

  componentDidMount() {
    // gameRef.child("moves").once("value", data => { // get all moves made on the game and load from it current board state
    //   this.loadCurrentBoardState(data.val());
    // });

    // at the beginning cache whole game data from server
    this.state.gameRef.once("value", data => {
      this.cacheGameData(data.val()); 
    });

    // listen to changes of active player's color
    this.state.gameRef.child("activePlayerColor").on("value", data => {
      this.updatePageActivePlayerColor(data.val());
    });

   /*  // listen to added moves, on start load each added move seperately (in order)
    this.state.gameRef.child("moves").on("child_added", data => {
        this.playMoveOnBoard(data.val());
    }); */

    // listen to changes on boardState
    this.state.gameRef.child('boardState').on('value', data => {
      drawChessPieces(this.state.board);
    })

    /* const chessPieces = initChessPieces(); // get starting chess pieces positions
        const chessBoard = initBoard(chessPieces); // put pieces on board */
    drawBoard(updateBoard); // draw board and add listener to every piece/figure
    //drawChessPieces(this.state.board); // draw pieces on board

    this.state.gameRef.child('boardState').set(this.state.board);
  }

  // this function might be not needed
  cacheGameData(data) {
    const gameData = {
      whitePlayerUid: data.whitePlayerUid,
      blackPlayerUid: data.blackPlayerUid,
      activePlayerColor: data.activePlayerColor,
      winner: data.winner,
      moves: [], // cached in playMoveOnBoard()
      boardState: data.boardState
    }
    this.setState({ game: gameData });
    console.log("Db game data: ", this.state.game);
  }

  // load board state by replaying moves
  // playMovesOnBoard(data) {
  //   if (!data) {
  //     return;
  //   }
  //   //const movesSkipLastMove = data.slice(0, data.length - 1);
  //   data.forEach( (element) => { // replay every move made until now (load current board state)
  //     const move = this.prepareMove(element); // get move tiles
  //     movePieceWithoutChecking(move);
  //   });
  // }

 /*  playMoveOnBoard(data) {
    this.addMoveToState(data); // push move to state
    movePieceWithoutChecking(data);
  } */

 /*  addMoveToState(move) {
    const gameData = this.state.game;
    gameData.moves.push(move);
    this.setState({ game: gameData });
  } */

  updatePageActivePlayerColor(data) {
    const gameData = this.state.game;
    gameData.activePlayerColor = data;
    this.setState({ game: gameData });
  }    

  moveCallback(targetElem, activeElem) { 
    // move activeElem to elem
    console.log('targetElem: ', targetElem);
    console.log('activeElem ', activeElem);
    console.log(this.state.board);
  }

}

const updateBoard = function(targetElem, activeElem) { 
  // move activeElem to elem
  console.log('targetElem: ', targetElem);
  console.log('activeElem ', activeElem);
  console.log(this.state.board);
}

const resetMoves = function(board) {
  const movesRef = database().ref("games").child(userCachedData.gameId).child("moves");
  movesRef.set([])
    .then(res => {
      drawChessPieces(board);
    });
}



// send heard move to database by appending it to db's moves array
/* const moveListener = function(move) {
  move.color = userCachedData.color; // player color who made the move
  const movesRef = database().ref("games").child(userCachedData.gameId).child("moves");
  // load moves from server to append them with new move
  movesRef.once("value", function(data) {
    addNewMoveToMovesOnServer(data.val(), move, movesRef); // pass moves, new move and db reference
  });

  console.log("listened move from chessboard: ", move);
  //console.log("moves array", moves);
}

const addNewMoveToMovesOnServer = function(moves, move, movesRef) {
  if (!moves) {
    moves = [];
  }
  moves.push(move);
  movesRef.set(moves);
  // after move has been made, set active player to opponent
  const activeColorRef = database().ref("games").child(userCachedData.gameId).child("activePlayerColor");
  // const isCurrentUserWhite = userCachedData.color === CHESS_COLORS.WHITE;
  // const opponentColor = isCurrentUserWhite ? CHESS_COLORS.BLACK : CHESS_COLORS.WHITE;
  activeColorRef.set // change active player color on server
    (userCachedData.color === CHESS_COLORS.WHITE ? CHESS_COLORS.BLACK : CHESS_COLORS.WHITE); 
}
 */
