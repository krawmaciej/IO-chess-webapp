// initialize chess piece objects
const initBoard = (cp) => {
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
      board[j][i] = {};
  return board;
}

// drawing board
// draw board
const drawBoard = () => {
  const container = document.getElementById('chessBoard');
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
      moveChessPiece(tiles[i]);
	  console.log('tiles children: ', tiles[i]._cp);
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
const drawChessPieces = (board) => {
  board.forEach(e => {
    e.forEach(insertChessPiece); // insertChessPiece func automatically runs and takes each element of 2D array as an argument (JS syntax)
  });
}
// tool func to insert each piece 
const insertChessPiece = (piece) => {
  if (!(Object.keys(piece).length === 0 && piece.constructor === Object)) // this checks if 'piece' object is not empty
  {
    const elem = document.getElementById(piece.posX + '_' + piece.posY);
    elem._cp = piece;
    elem.innerHTML = piece.code;
  }
}


const moviePieceWithoutChecking = (move) => {
	// move visual chess piece
      move.to.innerHTML = move.from.innerHTML;
      move.from.innerHTML = "";
      // move chess piece objects assigned to element 
      move.to._cp = move.from._cp;      
      move.from._cp = false;
      // update current chess piece object
      move.to._cp.active = false;
      move.to._cp.setPositions(parseInt(move.to.id.substr(0,1)), parseInt(move.to.id.substr(2,1)));
}

// moving chess pieces
const moveChessPiece = (elem) => {
  const parent = elem.parentElement;
  const activeElem = parent.activeElement;

  // if chess piece is no chosen, choose it and save relevant data
  if (elem._cp && !elem.parentElement.switcher) {    
    elem._cp.active = true; // ??
    elem.parentElement.switcher = true;
    elem.parentElement.activeElement = elem;
    elem.classList.toggle('active');

    // calculate possible moves for chess piece
    elem._cp.calculateMoves();
    console.log('possible moves --> ', elem._cp.possibleMoves); // TEMP
  } 
  // check if chess piece is chosen, if yes, try to move it
  else if (parent.switcher && activeElem) {    
    // check is new tile and empty, if yes, move chess piece there   
    if (!elem._cp && elem.innerHTML === '' && activeElem._cp.moveIsPossible(elem.id)) {
	  // get move to send it to other player
	  var move = {
		from: activeElem,//[parseInt(activeElem.id.substr(0, 1)), parseInt(activeElem.id.substr(2, 1))],
		to: elem//[parseInt(elem.id.substr(0, 1)), parseInt(elem.id.substr(2, 1))]
	  }
      moviePieceWithoutChecking(move);
	  
	  //console.log('move!!: ', move);
      /*
      console.log('this element -->', elem);      // TEMP
      console.log('prev(active) element -->', activeElem); // TEMP
      console.log('this chesspiece -->', elem._cp); // TEMP
      console.log('prev chesspiece -->', activeElem._cp); // TEMP
	  */
    }
     // set all temp data to original values
    activeElem.classList.toggle('active');
    activeElem._cp.active = false;
    parent.switcher = false;
  }  
}


