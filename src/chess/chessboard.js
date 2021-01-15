import { CHESS_COLORS } from './chess';

// drawing board
const drawBoard = (chess, callback) => {
  const container = document.getElementById('chessBoard');
  container.switcher = false;
  container.chess = chess;
  let toggle = true;

  // draw tiles
  if (chess.thisPlayerColor === CHESS_COLORS.WHITE) {    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        container.appendChild(makeTile(toggle, i, j));      
        toggle = !toggle;
      }
      toggle = !toggle;
    }
  }
  else if (chess.thisPlayerColor === CHESS_COLORS.BLACK) {
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
const drawChessPieces = (color) => {
  const container = document.getElementById('chessBoard');
  container.activePlayerColor = color;

  for (let i = 0; i < container.chess.board.length; i++) {
    for (let j = 0; j < container.chess.board[i].length; j++) {
      insertChessPiece(container.chess.board[i][j], i, j);
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
  const chess = container.chess;

  // console.log(chess.thisPlayerColor, container.activePlayerColor)
  if (chess.thisPlayerColor !== container.activePlayerColor) {
    alert(`It's not your turn yet!`);
    return;
  } 

  // IF CHESSPIECE IS NOT CHOSEN YET
  if (!targetElem.parentElement.switcher && 
      targetElem.chessPiece && targetElem.chessPiece.color === chess.thisPlayerColor) 
  {
    saveMoveData(container, targetElem); // save relevant data for future
    //targetElem.chessPiece.calculateMoves(board); // calculate possible moves for active chess piece
    //console.log('possible moves --> ', targetElem.chessPiece.regularMoves); // TEMP
    //console.log('possible attacks --> ', targetElem.chessPiece.attackMoves);    
  }
  // IF CHESSPIECE IS ALREADY CHOSEN
  else if (container.switcher && activeElem) 
  {    
    const activeElemId = parseElemId(activeElem);
    const targetElemId = parseElemId(targetElem);
    const move = { 
      From: activeElemId, 
      To: targetElemId
    }

    if ((targetElem.chessPiece && activeElem.chessPiece.attackIsPossible(targetElem.id)) ||
    (!targetElem.chessPiece && activeElem.chessPiece.moveIsPossible(targetElem.id))) 
    {    
      ///*temp*/makeMove(board, move);
      callback(move);     
    }
    container.switcher = false;
    activeElem.classList.toggle('active');
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


export { drawBoard, drawChessPieces };