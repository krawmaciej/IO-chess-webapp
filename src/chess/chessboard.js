import { initChessPieces, CHESS_COLORS } from './chess';
// import { CHESS_COLORS } from '../../chess/chess.js';
const initBoard = () => {
  const cp = initChessPieces();
  const board = [];
  for (let i = 0; i < 8; i++)
    board[i] = [];

  // WHITE
  board[cp.wPawn0.posX][cp.wPawn0.posY] = cp.wPawn0;
  board[cp.wPawn1.posX][cp.wPawn1.posY] = cp.wPawn1;
  board[cp.wPawn2.posX][cp.wPawn2.posY] = cp.wPawn2;
  board[cp.wPawn3.posX][cp.wPawn3.posY] = cp.wPawn3;
  board[cp.wPawn4.posX][cp.wPawn4.posY] = cp.wPawn4;
  board[cp.wPawn5.posX][cp.wPawn5.posY] = cp.wPawn5;
  board[cp.wPawn6.posX][cp.wPawn6.posY] = cp.wPawn6;
  board[cp.wPawn7.posX][cp.wPawn7.posY] = cp.wPawn7;
  board[cp.wRook0.posX][cp.wRook0.posY] = cp.wRook0;    
  board[cp.wRook1.posX][cp.wRook1.posY] = cp.wRook1;
  board[cp.wKnight0.posX][cp.wKnight0.posY] = cp.wKnight0;
  board[cp.wKnight1.posX][cp.wKnight1.posY] = cp.wKnight1;
  board[cp.wBishop0.posX][cp.wBishop0.posY] = cp.wBishop0;  
  board[cp.wBishop1.posX][cp.wBishop1.posY] = cp.wBishop1; 
  board[cp.wKing.posX][cp.wKing.posY] = cp.wKing;  
  board[cp.wQueen.posX][cp.wQueen.posY] = cp.wQueen;   
  
  // BLACK
  board[cp.bPawn0.posX][cp.bPawn0.posY] = cp.bPawn0;
  board[cp.bPawn1.posX][cp.bPawn1.posY] = cp.bPawn1;
  board[cp.bPawn2.posX][cp.bPawn2.posY] = cp.bPawn2;
  board[cp.bPawn3.posX][cp.bPawn3.posY] = cp.bPawn3;
  board[cp.bPawn4.posX][cp.bPawn4.posY] = cp.bPawn4;
  board[cp.bPawn5.posX][cp.bPawn5.posY] = cp.bPawn5;
  board[cp.bPawn6.posX][cp.bPawn6.posY] = cp.bPawn6;
  board[cp.bPawn7.posX][cp.bPawn7.posY] = cp.bPawn7;
  board[cp.bRook0.posX][cp.bRook0.posY] = cp.bRook0;    
  board[cp.bRook1.posX][cp.bRook1.posY] = cp.bRook1;
  board[cp.bKnight0.posX][cp.bKnight0.posY] = cp.bKnight0;
  board[cp.bKnight1.posX][cp.bKnight1.posY] = cp.bKnight1;
  board[cp.bBishop0.posX][cp.bBishop0.posY] = cp.bBishop0;  
  board[cp.bBishop1.posX][cp.bBishop1.posY] = cp.bBishop1; 
  board[cp.bKing.posX][cp.bKing.posY] = cp.bKing;  
  board[cp.bQueen.posX][cp.bQueen.posY] = cp.bQueen; 
  
  // BLANK
  for (let i = 0; i < 8; i++) 
    for (let j = 2; j < 6; j++)
      board[j][i] = false;
  return board;
}

// drawing board
const drawBoard = (board, callback, color) => {
  const container = document.getElementById('chessBoard');
  container.board = board;
  container.switcher = false;
  container.kingIsChecked = false;
  container.kings = { wKing: board[7][4], bKing: board[0][4] };
  let toggle = true;

  // draw tiles
  if (color === CHESS_COLORS.WHITE) {    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        container.appendChild(makeTile(toggle, i, j));      
        toggle = !toggle;
      }
      toggle = !toggle;
    }
  }
  else if (color === CHESS_COLORS.BLACK) {
    for (let i = 7; i >= 0; i--) {
      for (let j = 0; j < 8; j++) {
        container.appendChild(makeTile(toggle, i, j));      
        toggle = !toggle;
      }
      toggle = !toggle;
    }
  }  

  // add onclick event listeners
  const tiles = document.getElementById('chessBoard').children;
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', () => {
      moveChessPiece(tiles[i], callback);
    });
  }  
}
// create chess board tile element
const makeTile = (color, x, y) => {
  const elem = document.createElement('div');
  elem.classList.add('boardSquare', color ? 'boardSquareWhite' : 'boardSquareBlack' );
  elem.id = x + '_' + y;

  // FOR TESTING
  elem.title = x + ',' + y;

  return elem;
}


// drawing chess pieces
// put chess pieces to starting positions
const drawChessPieces = (board, props) => {
  const container = document.getElementById('chessBoard');
  container.props = props;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      insertChessPiece(board[i][j], i, j);
    }
  }
}
// tool func to insert each piece 
const insertChessPiece = (e, posX, posY) => {
  const elem = document.getElementById(posX + '_' + posY);
  // if (!(Object.keys(e).length === 0 && e.constructor === Object)) // this checks if 'piece' object is not empty
  if (e)
  {
    elem.chessPiece = e;
    elem.innerHTML = e.code;
  }
  else {
    elem.innerHTML = '';
    elem.chessPiece = false;
  }
}

// moving chess pieces
const moveChessPiece = (targetElem, callback) => { 
  const container = targetElem.parentElement;
  const activeElem = container.activeElement; 
  const board = container.board;
  const props = container.props;
  const king = getActiveKing(container.kings, props.thisPlayerColor);

  if (props.thisPlayerColor !== props.activePlayerColor) {
    alert(`It's not your turn yet!`);
    return;
  } 

  // IF CHESSPIECE IS NOT CHOSEN YET
  if (!targetElem.parentElement.switcher && 
      targetElem.chessPiece && targetElem.chessPiece.color === props.thisPlayerColor) 
  {
    if (king.isChecked(board)) {
          // is king checked?
    //   if yes, calculate available moves to escape 
    //     if this move is one of available moves, do it
    //     else console.log(save king);
      //king.calculateMovesWhenChecked(board); // calculate possible moves for chess pieces when king is checked
      // 1) figures which can move when king is checked
      // 2) moves which can be made by thouse figures
      if (king.canMoveWhenChecked(targetElem.chessPiece.id)) {
        saveMoveData(container, targetElem); // save relevant data for future        
        container.kingIsChecked = true;      
      }
      else 
        alert('Your King is under attack! Defend the King!');  
    }
    // king is NOT checked
    else {
      saveMoveData(container, targetElem); // save relevant data for future
      targetElem.chessPiece.calculateMoves(board); // calculate possible moves for active chess piece
      console.log('possible moves --> ', targetElem.chessPiece.regularMoves); // TEMP
      console.log('possible attacks --> ', targetElem.chessPiece.attackMoves);
    }     
  }
  // IF CHESSPIECE IS ALREADY CHOSEN
  else if (container.switcher && activeElem) 
  {    
    if (container.kingIsChecked) {
      // if (!targetElem.chessPiece)
      //   move to empty tile 
      // else if (targetElem.chessPiece)
      //   attack enemy piece
      // container.kingIsChecked = false;
    }  
    else 
      sendMoveToDb(activeElem, targetElem, callback/*, tempmakeMove*/);
    // set all temp data to original values (regardless if move is succesful or not)
    container.switcher = false;
    activeElem.classList.toggle('active');
  }
}

const makeMove = (board, move) => {
  board[move.From.x][move.From.y].setPositions(move.To.x, move.To.y); //positions
  board[move.To.x][move.To.y] = board[move.From.x][move.From.y];
  board[move.From.x][move.From.y] = false;
}

const sendMoveToDb = (activeElem, targetElem, cb/*, tempcb2*/) => {
  const activeElemCoords = parseElemId(activeElem);
  const targetElemCoords = parseElemId(targetElem);
   // if tile is NOT empty
  if (targetElem.chessPiece && activeElem.chessPiece.attackIsPossible(targetElem.id)) {   
    console.log(activeElemCoords.x + ', ' + activeElemCoords.y + ' --> ' + targetElemCoords.x + ', ' + targetElemCoords.y);
    cb({ 
      From: { x: activeElemCoords.x, y: activeElemCoords.y }, 
      To: { x: targetElemCoords.x, y: targetElemCoords.y}
    });
  }
  // if tile empty
  else if (!targetElem.chessPiece && activeElem.chessPiece.moveIsPossible(targetElem.id)) { 
    cb({ 
      From: { x: activeElemCoords.x, y: activeElemCoords.y }, 
      To: { x: targetElemCoords.x, y: targetElemCoords.y}
    });
  }
}

const saveMoveData = (container, targetElem) => {
  container.switcher = true;
  container.activeElement = targetElem;
  targetElem.classList.toggle('active');
}

const parseElemId = e => {
  return {
    x: parseInt(e.id.substr(0,1)),
    y: parseInt(e.id.substr(2,1))
  }
}

const getActiveKing = (kings, color) => {
  // find out which players turn is it
  if (color === CHESS_COLORS.WHITE)
    return kings.wKing;
  else if (color === CHESS_COLORS.BLACK)
    return kings.bKing;
}


export { initBoard, drawBoard, drawChessPieces, makeMove };