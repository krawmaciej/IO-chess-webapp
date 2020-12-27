import { CHESS_COLORS, initChessPieces } from './chess';
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
const drawBoard = (board, callback) => {
  const container = document.getElementById('chessBoard');
  container.board = board;
  container.switcher = false;
  let toggle = true;

  // draw tiles
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      container.appendChild(makeTile(toggle, i, j));      
      toggle = !toggle;
    }
    toggle = !toggle;
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

  console.log(props);
  // if chess piece is not chosen, choose it and save relevant data
  if (targetElem.chessPiece && 
      !targetElem.parentElement.switcher && 
      props.activePlayerColor === props.thisPlayerColor &&
      targetElem.chessPiece.color === props.thisPlayerColor)     
  { 
    container.switcher = true;
    container.activeElement = targetElem;
    targetElem.classList.toggle('active');

    // calculate possible moves for chess piece
    targetElem.chessPiece.calculateMoves();
    console.log('possible moves --> ', targetElem.chessPiece.possibleMoves); // TEMP
  } 
  // check if chess piece is chosen, if yes, try to move it
  else if (container.switcher && activeElem) 
  {    
    // check is new tile and empty, if yes, move chess piece there   
    if (!targetElem.chessPiece && 
        targetElem.innerHTML === '' && 
        activeElem.chessPiece.moveIsPossible(targetElem.id)) 
    { 
      
      // update board state matrix
      const activeElemId = parseElemId(activeElem);
      const targetElemId = parseElemId(targetElem);
      //console.log(`${activeElemId.x},${activeElemId.y} --> ${targetElemId.x},${targetElemId.y}`);

      // set new position for a chess piece 
      board[activeElemId.x][activeElemId.y].setPositions(targetElemId.x, targetElemId.y);

      // fancy js-way to swap elements in array (destructuring)
      [board[activeElemId.x][activeElemId.y], board[targetElemId.x][targetElemId.y]] = 
        [board[targetElemId.x][targetElemId.y], board[activeElemId.x][activeElemId.y]];    

      callback();
    }
    // set all temp data to original values
    container.switcher = false;
    activeElem.classList.toggle('active');
  }
  else if (props.thisPlayerColor !== props.activePlayerColor)
  {
    alert(`It's not your turn yet!`);
  }
   
}

const parseElemId = e => {
  return {
    x: parseInt(e.id.substr(0,1)),
    y: parseInt(e.id.substr(2,1))
  }
}

export { initBoard, drawBoard, drawChessPieces };