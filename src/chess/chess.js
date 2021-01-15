// module "chess.js"
/* eslint-disable no-unused-expressions */
const STATIC_ID = {
  'Pawn': 0,
  'Rook': 0,
  'Knight': 0,
  'Bishop': 0,
  'Queen': 0,
  'King': 0
}
const CHESS_COLORS = { // chess color enum
  WHITE: 'white',
  BLACK: 'black'
}
const CHESS_TYPES = {
  PAWN: 'Pawn',
  ROOK: 'Rook',
  KNIGHT: 'Knight',
  BISHOP: 'Bishop',
  KING: 'King',
  QUEEN: "Queen",
}
const XY = (x, y) => {
  return {
    x: x,
    y: y
  }
}
const FromTo = (o1, o2) => {
  return {
    From: o1,
    To: o2
  }
}
const isWithinBound = (obj) => {
  if (obj.x > 7 || obj.x < 0 || obj.y > 7 || obj.y < 0)
    return false;
  return true;
}

class Chess {
  constructor(color) {
    this.board = this.initBoard();
    this.calculateMoves();
    this.thisPlayerColor = color;
    this.whiteHasMoves = true;
    this.blackHasMoves = true;
    this.winner = "";
  }

  initChessPieces = () => {
    return {
      wPawn0: new Pawn(CHESS_COLORS.WHITE, 6, 0),
      wPawn1: new Pawn(CHESS_COLORS.WHITE, 6, 1),
      wPawn2: new Pawn(CHESS_COLORS.WHITE, 6, 2),
      wPawn3: new Pawn(CHESS_COLORS.WHITE, 6, 3),
      wPawn4: new Pawn(CHESS_COLORS.WHITE, 6, 4),
      wPawn5: new Pawn(CHESS_COLORS.WHITE, 6, 5),
      wPawn6: new Pawn(CHESS_COLORS.WHITE, 6, 6),
      wPawn7: new Pawn(CHESS_COLORS.WHITE, 6, 7),
      wRook0: new Rook(CHESS_COLORS.WHITE, 7, 0),
      wRook1: new Rook(CHESS_COLORS.WHITE, 7, 7),
      wKnight0: new Knight(CHESS_COLORS.WHITE, 7, 1),
      wKnight1: new Knight(CHESS_COLORS.WHITE, 7, 6),
      wBishop0: new Bishop(CHESS_COLORS.WHITE, 7, 2),
      wBishop1: new Bishop(CHESS_COLORS.WHITE, 7, 5),
      wKing: new King(CHESS_COLORS.WHITE, 7, 4),
      wQueen: new Queen(CHESS_COLORS.WHITE, 7, 3),
  
      bPawn0: new Pawn(CHESS_COLORS.BLACK, 1, 0),
      bPawn1: new Pawn(CHESS_COLORS.BLACK, 1, 1),
      bPawn2: new Pawn(CHESS_COLORS.BLACK, 1, 2),
      bPawn3: new Pawn(CHESS_COLORS.BLACK, 1, 3),
      bPawn4: new Pawn(CHESS_COLORS.BLACK, 1, 4),
      bPawn5: new Pawn(CHESS_COLORS.BLACK, 1, 5),
      bPawn6: new Pawn(CHESS_COLORS.BLACK, 1, 6),
      bPawn7: new Pawn(CHESS_COLORS.BLACK, 1, 7),
      bRook0: new Rook(CHESS_COLORS.BLACK, 0, 0),
      bRook1: new Rook(CHESS_COLORS.BLACK, 0, 7),
      bKnight0: new Knight(CHESS_COLORS.BLACK, 0, 1),
      bKnight1: new Knight(CHESS_COLORS.BLACK, 0, 6),
      bBishop0: new Bishop(CHESS_COLORS.BLACK, 0, 2),
      bBishop1: new Bishop(CHESS_COLORS.BLACK, 0, 5),
      bKing: new King(CHESS_COLORS.BLACK, 0, 4),
      bQueen: new Queen(CHESS_COLORS.BLACK, 0, 3)
    }
  }
  
  initBoard = () => {
    const cp = this.initChessPieces();
    const board = [];
    for (let i = 0; i < 8; i++)
      board[i] = [];
    for(const c in cp) {
      cp[c].chess = this;
    }
  
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
  
    // King
    board.kings = { wKing: cp.wKing, bKing: cp.bKing }
  
    return board;
  }

  copyBoard() {
    const res = [];

    for (let i = 0; i < this.board.length; i++) {
      const tmp = [];
      for(let j = 0; j < this.board[i].length; j++) {
        tmp.push(this.board[i][j]);
      }
      res.push(tmp);
    }
    res.kings = this.board.kings;  

    return res;
  }

  makeMove(move) {
    this.board[move.From.x][move.From.y].setPositions(move.To.x, move.To.y); //positions
    this.board[move.To.x][move.To.y] = this.board[move.From.x][move.From.y];
    this.board[move.From.x][move.From.y] = false;
  }

  simulateMove(board, move) {
    board[move.From.x][move.From.y].setPositions(move.To.x, move.To.y); //positions
    board[move.To.x][move.To.y] = board[move.From.x][move.From.y];
    board[move.From.x][move.From.y] = false;
  }

  revertSimulation(board, move) {
    board[move.To.x][move.To.y].setPositions(move.From.x, move.From.y);
  }

  isGameOver(color) {
    if (!this.whiteHasMoves) {
      this.winner = CHESS_COLORS.BLACK;
      return true;
    }
    if (!this.blackHasMoves) {
      this.winner = CHESS_COLORS.WHITE;
      return true;
    }      
    return false;
  }

  calculateMoves() {
    const whiteMoves = [], blackMoves = [];
    this.board.forEach(row => {
      row.forEach(cp => {
        if (cp)
          cp.calculateMoves(this.board);
          if (cp.color === CHESS_COLORS.WHITE) {
            cp.regularMoves.forEach(m => {
              whiteMoves.push(m);
            })
            cp.attackMoves.forEach(m => {
              whiteMoves.push(m);
            })
          }            
          else if (cp.color === CHESS_COLORS.BLACK) {
            cp.regularMoves.forEach(m => {
              blackMoves.push(m);
            })
            cp.attackMoves.forEach(m => {
              blackMoves.push(m);
            })
          }
      })
    })
    if (whiteMoves.length === 0)
      this.whiteHasMoves = false;
    if (blackMoves.length === 0)
      this.blackHasMoves = false;
    // console.log('whiteMoves: ', whiteMoves)
    // console.log('blackMoves: ', blackMoves);
  }  
}

class ChessPiece { // treat it as an abstract class
  constructor(color, posX, posY) {
    this.id;
    this.color = color;    
    this.posX = posX;
    this.posY = posY;
    this.type = '';
    this.startPosX = posX;
    this.startPosY = posY;

    this.regularMoves = [];    
    this.attackMoves = [];

  }

  setPositions(x, y) {
    this.posX = x;
    this.posY = y;
  }

  checkPath(board, cb, kingIsSafe) {
    const thisCoords = XY(this.posX, this.posY);    
    const thisTile = board[thisCoords.x][thisCoords.y];
    let nextCoords = cb(thisCoords);
    while(isWithinBound(nextCoords)) {
      const nextTile = board[nextCoords.x][nextCoords.y];

      if (!nextTile && this.isKingSafe(kingIsSafe, thisCoords, nextCoords))
      {
        this.regularMoves.push([ nextCoords.x, nextCoords.y ]);
      }
      else if (nextTile && nextTile.color !== thisTile.color && this.isKingSafe(kingIsSafe, thisCoords, nextCoords))
      {
        this.attackMoves.push([ nextCoords.x, nextCoords.y ]);
        break;
      }
      else if (nextTile && nextTile.color === thisTile.color)
        break;
      nextCoords = cb(nextCoords);
    }
  }
  
  checkPathSingle(board, cb, kingIsSafe) {
    const thisCoords = XY(this.posX, this.posY);    
    const thisTile = board[thisCoords.x][thisCoords.y];
    const nextCoords = cb(thisCoords);
    
    if (isWithinBound(nextCoords)) 
    {
      const nextTile = board[nextCoords.x][nextCoords.y];
      if (!nextTile && this.isKingSafe(kingIsSafe, thisCoords, nextCoords))
      {
        this.regularMoves.push([ nextCoords.x, nextCoords.y ]);
      }
      else if (nextTile && nextTile.color !== thisTile.color && this.isKingSafe(kingIsSafe, thisCoords, nextCoords))
      {
        this.attackMoves.push([ nextCoords.x, nextCoords.y ]);
      }
    }
    
  }

  moveIsPossible(id) {
    const move = [parseInt(id.substr(0, 1)), parseInt(id.substr(2, 1))];
    const posMoves = this.regularMoves;

    for (let i = 0; i < posMoves.length; i++) {
      if (posMoves[i][0] === move[0] && posMoves[i][1] === move[1])
        return true;
    }
    // console.log(`no, you can't move there`);
    return false;
  }

  attackIsPossible(id) {
    const move = [parseInt(id.substr(0, 1)), parseInt(id.substr(2, 1))];
    const posMoves = this.attackMoves;

    for (let i = 0; i < posMoves.length; i++) {
      if (posMoves[i][0] === move[0] && posMoves[i][1] === move[1])
        return true;
    }
    // console.log('No, you can\'t attack that');
    return false;
  }



  // for checkmate

  isKingSafeAfterMove(board, move) {
    const thisKing = this.color === CHESS_COLORS.WHITE ? board.kings.wKing : board.kings.bKing;
    const isKingChecked = thisKing.isChecked(board); // <-
    const newBoard = this.chess.copyBoard(board); // <- 64
    this.chess.simulateMove(newBoard, move);
    const newKing = this.color === CHESS_COLORS.WHITE ? newBoard.kings.wKing : newBoard.kings.bKing;
    const isNewKingChecked = newKing.isChecked(newBoard); // <-
    this.chess.revertSimulation(newBoard, move);

    //console.log('simulated move: ', move.From, '->', move.To);

    if(!isKingChecked) {        
      if (!isNewKingChecked)
        return true;
      else
        return false;
    }
    else {
      if (isNewKingChecked)
        return false;
      else
        return true;
    }
  }

  isKingSafe(kingIsSafe, current, next) {
    return kingIsSafe ? true : this.isKingSafeAfterMove(this.chess.board, FromTo(current, next));
  }

  // basic moves

  moveUp(o) {
    return XY(o.x - 1, o.y);
  }
  moveDown(o) {
    return XY(o.x + 1, o.y);
  }
  moveLeft(o) {
    return XY(o.x, o.y - 1);
  } 
  moveRight(o) {
    return XY(o.x, o.y + 1);
  }
  moveUpLeft(o) {
    return XY(o.x - 1, o.y - 1);
  }
  moveUpRight(o) {
    return XY(o.x - 1, o.y + 1);
  }
  moveDownLeft(o) {
    return XY(o.x + 1, o.y - 1);
  }
  moveDownRight(o) {
    return XY(o.x + 1, o.y + 1);
  }
  movesKnight(o) {
    return [
      XY(o.x + 2, o.y - 1),
      XY(o.x + 2, o.y + 1),
      XY(o.x - 2, o.y - 1),
      XY(o.x - 2, o.y + 1),
      XY(o.x + 1, o.y - 2),
      XY(o.x + 1, o.y + 2),
      XY(o.x - 1, o.y - 2),
      XY(o.x - 1, o.y + 2)    
    ]
  }
}

class Pawn extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);
    
    this.type = CHESS_TYPES.PAWN;
    this.code = this.color === CHESS_COLORS.WHITE ? "&#9817;" : "&#9823;";
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }

  pawn_checkMoveRegular(board, cb, kingIsSafe) {
    const thisCoords = XY(this.posX, this.posY);   
    const nextCoords = cb(thisCoords);
    const nextTile = board[nextCoords.x][nextCoords.y];

    if (this.posX === this.startPosX && this.posY === this.startPosY) {
      const secondNextCoords = cb(nextCoords);
      const secondNextTile = board[secondNextCoords.x][secondNextCoords.y];
      if (!secondNextTile && this.isKingSafe(kingIsSafe, thisCoords, secondNextCoords)) {
        this.regularMoves.push([ secondNextCoords.x, secondNextCoords.y ]);
      } 
    }      
    if (!nextTile && this.isKingSafe(kingIsSafe, thisCoords, nextCoords)) {      
      this.regularMoves.push([ nextCoords.x, nextCoords.y ]);        
    }

  }

  pawn_checkMoveAttack(board, cb, kingIsSafe) {
    const thisCoords = XY(this.posX, this.posY);   
    const thisTile = board[thisCoords.x][thisCoords.y];
    const nextCoords = cb(thisCoords);
    const nextTile = board[nextCoords.x][nextCoords.y];
    if (nextTile && nextTile.color !== thisTile.color && this.isKingSafe(kingIsSafe, thisCoords, nextCoords))
    {
      this.attackMoves.push([ nextCoords.x, nextCoords.y ]);
    }
  }

  calculateMoves(board, kingIsSafe) {
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    if (this.color === CHESS_COLORS.WHITE) {
      this.pawn_checkMoveRegular(board, this.moveUp, kingIsSafe);
      this.pawn_checkMoveAttack(board, this.moveUpLeft, kingIsSafe);
      this.pawn_checkMoveAttack(board, this.moveUpRight, kingIsSafe);
    }
    else if (this.color === CHESS_COLORS.BLACK) {
      this.pawn_checkMoveRegular(board, this.moveDown, kingIsSafe);
      this.pawn_checkMoveAttack(board, this.moveDownLeft, kingIsSafe);
      this.pawn_checkMoveAttack(board, this.moveDownRight, kingIsSafe);
    }
  }  
}

class Rook extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = CHESS_TYPES.ROOK;
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9814' : '&#9820';
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }


  calculateMoves(board, kingIsSafe) {
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    this.checkPath(board, this.moveUp, kingIsSafe);
    this.checkPath(board, this.moveDown, kingIsSafe);
    this.checkPath(board, this.moveLeft, kingIsSafe);
    this.checkPath(board, this.moveRight, kingIsSafe);
  }
}

class Knight extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = CHESS_TYPES.KNIGHT;
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9816' : '&#9822';
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }

  calculateMoves(board, kingIsSafe) {
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);
    // actual logic
    const knightMoves = this.movesKnight(XY(this.posX, this.posY));
    knightMoves.forEach(m => {
      if (isWithinBound(m)) {
        const targetTile = board[m.x][m.y];
        if (!targetTile && this.isKingSafe(kingIsSafe, XY(this.posX, this.posY), XY(m.x, m.y))) // target tile is empty)
          this.regularMoves.push([m.x, m.y]);
        else if (targetTile && targetTile.color !== this.color
          && this.isKingSafe(kingIsSafe, XY(this.posX, this.posY), XY(m.x, m.y))) // target tile has chess piece of oposite color
          this.attackMoves.push([m.x, m.y]);
      }
    });
  }
}

class Bishop extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = CHESS_TYPES.BISHOP;
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9815' : '&#9821';
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }

  calculateMoves(board, kingIsSafe) {    
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    this.checkPath(board, this.moveUpLeft, kingIsSafe);
    this.checkPath(board, this.moveUpRight, kingIsSafe);
    this.checkPath(board, this.moveDownLeft, kingIsSafe);
    this.checkPath(board, this.moveDownRight, kingIsSafe);
  }
}

class King extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = CHESS_TYPES.KING;
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9812' : '&#9818'; 
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;

    this.threatPos = {};

    this.availableChesspiecesWhenChecked = [];
    this.movesWhenChecked = [];
  }

  isChecked(board) {
    const currentPos = XY(this.posX, this.posY);
    const arr = [this.moveUp, this.moveDown, this.moveLeft, this.moveRight,
      this.moveUpLeft, this.moveUpRight, this.moveDownLeft, this.moveDownRight];

    for (let i = 0; i < arr.length; i++) {
      let curPos = arr[i](currentPos);
      while(isWithinBound(curPos)) {        
        const cp = board[curPos.x][curPos.y];
        if(cp && cp.color === this.color)
            break;
        else if (cp && cp.color !== this.color) {
          cp.calculateMoves(board, true); // THIS IS GOING TO BE GONE
          if (cp.attackMoves && this.isKingInDanger(cp.attackMoves)) {
            this.threatPos = curPos;         
            return true;
          }
        }          
        curPos = arr[i](curPos);
      }    
    }

    const knightMoves = this.movesKnight(XY(this.posX, this.posY));
    for (let i = 0; i < knightMoves.length; i++) {
      const m = knightMoves[i];
      if (isWithinBound(m)) {
        //console.log('moves: ', m);
        const cp = board[m.x][m.y];
        if (cp && cp.color !== this.color && cp.type === CHESS_TYPES.KNIGHT) {
          //console.log('threat');
          this.threatPos = m;
          return true;
        }
      }
    }
    return false;
  }

  isKingInDanger(enemyAttackMoves) {
    const currentPos = XY(this.posX, this.posY);
    
    for (let i = 0; i < enemyAttackMoves.length; i++) {
      // console.log(enemyAttackMoves[0], currentPos.x, enemyAttackMoves[1], currentPos.y)
      if (enemyAttackMoves[i][0] === currentPos.x && enemyAttackMoves[i][1] === currentPos.y)
        return true;
    }
    return false;
  }

  calculateMoves(board, kingIsSafe) {
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    this.checkPathSingle(board, this.moveUp);
    this.checkPathSingle(board, this.moveDown);
    this.checkPathSingle(board, this.moveLeft);
    this.checkPathSingle(board, this.moveRight);
    this.checkPathSingle(board, this.moveUpLeft);
    this.checkPathSingle(board, this.moveUpRight);
    this.checkPathSingle(board, this.moveDownLeft);
    this.checkPathSingle(board, this.moveDownRight);
  }
}

class Queen extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = CHESS_TYPES.QUEEN;
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9813' : '&#9819';
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }

  calculateMoves(board, kingIsSafe) {
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    this.checkPath(board, this.moveUp, kingIsSafe);
    this.checkPath(board, this.moveDown, kingIsSafe);
    this.checkPath(board, this.moveLeft, kingIsSafe);
    this.checkPath(board, this.moveRight, kingIsSafe);
    this.checkPath(board, this.moveUpLeft, kingIsSafe);
    this.checkPath(board, this.moveUpRight, kingIsSafe);
    this.checkPath(board, this.moveDownLeft, kingIsSafe);
    this.checkPath(board, this.moveDownRight, kingIsSafe);    

  }
}




const generateChessColor = () => {
  const colorIndex = Math.floor(Math.random() * 2); // randomize player's color

  if (colorIndex === 0) {
    return CHESS_COLORS.WHITE;
  }

  return CHESS_COLORS.BLACK;
}

export { CHESS_COLORS, generateChessColor, Chess };