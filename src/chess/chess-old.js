// module "chess.js"

class ChessPiece { // treat it as an abstract class
  constructor(color, posX, posY) {
    this.color = color;    
    this.posX = posX;
    this.posY = posY;
    this.type = '';
    this.active = false;
    this.startPosX = posX;
    this.startPosY = posY;

    this.possibleMoves = [];    
  }

  setPositions(x, y) {
    this.posX = x;
    this.posY = y;
  }

  calculateMoves() {
    console.log(`Not implemented for "${this.type}" yet`);
  }

  moveIsPossible(id) {
    const move = [parseInt(id.substr(0, 1)), parseInt(id.substr(2, 1))];
    const posMoves = this.possibleMoves;

    for (let i = 0; i < posMoves.length; i++) {
      if (posMoves[i][0] === move[0] && posMoves[i][1] === move[1])
        return true;
    }
    alert('No, you can\'t');
    return false;
  }
}

class Pawn extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);
    
    this.type = 'Pawn';
    this.code = this.color === CHESS_COLORS.WHITE ? "&#9817;" : "&#9823;";
  }

  calculateMoves() {
    if (this.color !== CHESS_COLORS.WHITE)
      return;
    // clear old data (bad place to do it, I know)
    this.possibleMoves.splice(0);

    // actual logic
    this.possibleMoves.push([ this.posX - 1, this.posY ]);
    if (this.posX === this.startPosX && this.posY === this.startPosY)
      this.possibleMoves.push([ this.posX - 2, this.posY ]);      
    
  }


  
}

class Rook extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'Rook';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9814' : '&#9820';
  }

  calculateMoves() {
    if (this.color !== CHESS_COLORS.WHITE)
      return;
    // clear old data (bad place to do it, I know)
    this.possibleMoves.splice(0);

    // actual logic
    for (let i = 0; i < 8; i++) {
      if (i !== this.posX)
        this.possibleMoves.push([ i, this.posY ]);
      if (i !== this.posY)
        this.possibleMoves.push([ this.posX, i]);
    }
  }
}

class Knight extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'Knight';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9816' : '&#9822';
  }

  calculateMoves() {
    if (this.color !== CHESS_COLORS.WHITE)
      return;
    // clear old data (bad place to do it, I know)
    this.possibleMoves.splice(0);

    // actual logic
    const moves = [];
    moves.push(
      [this.posX + 2, this.posY - 1],
      [this.posX + 2, this.posY + 1],
      [this.posX - 2, this.posY - 1],
      [this.posX - 2, this.posY + 1],
      [this.posX + 1, this.posY - 2],
      [this.posX + 1, this.posY + 2],
      [this.posX - 1, this.posY - 2],
      [this.posX - 1, this.posY + 2]
    );
    moves.forEach(m => {
      if (m[0] >= 0 && m[0] <= 7 && m[1] >= 0 && m[1] <= 7)
        this.possibleMoves.push([m[0], m[1]]);
    });
  }
}

class Bishop extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'Bishop';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9815' : '&#9821';
  }

  calculateMoves() {
    if (this.color !== CHESS_COLORS.WHITE)
      return;
    // clear old data (bad place to do it, I know)
    this.possibleMoves.splice(0);

    // actual logic
    

    // up-left to down-right
    const diff = Math.min(this.posX, this.posY);    
    let x = this.posX - diff,
        y = this.posY - diff;
    while(x <= 7 && y <= 7) {
      if (x !== this.posX || y !== this.posY)      
        this.possibleMoves.push([x, y]);
      x++; y++;
    }

    // down-left to up-right
    x = this.posX + this.posY > 7 ? 7 : this.posX + this.posY;
    y = x === 7 ? (this.posX + this.posY) % 7 : 0;
    while(x >= 0 && y <= 7) { // stop when (x < 0 OR y > 7)
      if (x !== this.posX && y !== this.posY)
        this.possibleMoves.push([x, y]);
      x--; y++;
    }
    

    // up-right
    // up-left
    // down-right
    // down-left
  }
}

class King extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'King';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9812' : '&#9818'; 
  }

  calculateMoves() {
    if (this.color !== CHESS_COLORS.WHITE)
      return;
    // clear old data (bad place to do it, I know)
    this.possibleMoves.splice(0);

    // actual logic
    const moves = [];
    for (let i = -1; i <= 1; i++) {
      moves.push( [this.posX + 1, this.posY + i] );
      moves.push( [this.posX - 1, this.posY + i] );
      moves.push( [this.posX, this.posY + i] );      
    }
    moves.forEach(m => {
      if (m[0] >= 0 && m[0] <= 7 && m[1] >= 0 && m[1] <= 7 && !(m[0] === this.posX && m[1] === this.posY))        
        this.possibleMoves.push([m[0], m[1]]);
    });
  }
}

class Queen extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'Queen';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9813' : '&#9819';
  }

  calculateMoves() {
    if (this.color !== CHESS_COLORS.WHITE)
      return;
    // clear old data (bad place to do it, I know)
    this.possibleMoves.splice(0);

    // actual logic

    // rook moves
    for (let i = 0; i < 8; i++) {
      if (i !== this.posX)
        this.possibleMoves.push([ i, this.posY ]);
      if (i !== this.posY)
        this.possibleMoves.push([ this.posX, i]);
    }
    // bishop moves
    const diff = Math.min(this.posX, this.posY);    
    let x = this.posX - diff,
        y = this.posY - diff;
    while(x <= 7 && y <= 7) {
      if (x !== this.posX || y !== this.posY)      
        this.possibleMoves.push([x, y]);
      x++; y++;
    }

    x = this.posX + this.posY > 7 ? 7 : this.posX + this.posY;
    y = x === 7 ? (this.posX + this.posY) % 7 : 0;
    while(x >= 0 && y <= 7) { // stop when (x < 0 OR y > 7)
      if (x !== this.posX && y !== this.posY)
        this.possibleMoves.push([x, y]);
      x--; y++;
    }
  }
}

/****************************************************************/

// initial board state for every chest match
export const initChessPieces = () => {
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

export const CHESS_COLORS = { // chess color enum
  WHITE: 'white',
  BLACK: 'black'
};

// export { initBoard, initChessPieces }