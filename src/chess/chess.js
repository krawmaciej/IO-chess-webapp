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
};

const XY = (x, y) => {
  return {
    x: x,
    y: y
  }
}

const isWithinBound = (obj) => {
  if (obj.x > 7 || obj.x < 0 || obj.y > 7 || obj.y < 0)
    return false;
  return true;
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

  checkPath(board, cb) {
    /* 
    loop as long as coords are within threshold {
      move up      
      if nextTile is empty
        add coords to regularMoves
      else if nextTile is not empty AND nextTile.piece.color !== thisTile.piece.color
        add coords to attackMoves
        break;
      else
        break;     
    }
    */
    const thisCoords = XY(this.posX, this.posY);    
    const thisTile = board[thisCoords.x][thisCoords.y];
    let nextCoords = cb(thisCoords);
    while(isWithinBound(nextCoords)) {
      const nextTile = board[nextCoords.x][nextCoords.y];

      if (!nextTile)
      {
        this.regularMoves.push([ nextCoords.x, nextCoords.y ]);
      }
      else if (nextTile && nextTile.color !== thisTile.color)
      {
        this.attackMoves.push([ nextCoords.x, nextCoords.y ]);
        break;
      }
      else
        break;
      nextCoords = cb(nextCoords);
    }
  }
  
  checkPathSingle(board, cb) {
    const thisCoords = XY(this.posX, this.posY);    
    const thisTile = board[thisCoords.x][thisCoords.y];
    const nextCoords = cb(thisCoords);
    
    if (isWithinBound(nextCoords)) 
    {
      const nextTile = board[nextCoords.x][nextCoords.y];
      if (!nextTile)
      {
        this.regularMoves.push([ nextCoords.x, nextCoords.y ]);
      }
      else if (nextTile && nextTile.color !== thisTile.color)
      {
        this.attackMoves.push([ nextCoords.x, nextCoords.y ]);
      }
    }
    
  }

  calculateMoves(board) {
    console.log(`Not implemented for "${this.type}" yet`);
  }

  moveIsPossible(id) {
    const move = [parseInt(id.substr(0, 1)), parseInt(id.substr(2, 1))];
    const posMoves = this.regularMoves;

    for (let i = 0; i < posMoves.length; i++) {
      if (posMoves[i][0] === move[0] && posMoves[i][1] === move[1])
        return true;
    }
    console.log(`no, you can't move there`);
    return false;
  }

  attackIsPossible(id) {
    const move = [parseInt(id.substr(0, 1)), parseInt(id.substr(2, 1))];
    const posMoves = this.attackMoves;

    for (let i = 0; i < posMoves.length; i++) {
      if (posMoves[i][0] === move[0] && posMoves[i][1] === move[1])
        return true;
    }
    console.log('No, you can\'t attack that');
    return false;
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
}

class Pawn extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);
    
    this.type = 'Pawn';
    this.code = this.color === CHESS_COLORS.WHITE ? "&#9817;" : "&#9823;";
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }

  pawn_checkMoveRegular(board, cb) {
    const thisCoords = XY(this.posX, this.posY);   
    const nextCoords = cb(thisCoords);
    const nextTile = board[nextCoords.x][nextCoords.y];
    if (!nextTile) {
      this.regularMoves.push([ nextCoords.x, nextCoords.y ]);
      if (this.posX === this.startPosX && this.posY === this.startPosY) {
        const secondNextCoords = cb(nextCoords);
        const secondNextTile = board[secondNextCoords.x][secondNextCoords.y];
        if (!secondNextTile)
          this.regularMoves.push([ secondNextCoords.x, secondNextCoords.y ])
      }
    }
  }

  pawn_checkMoveAttack(board, cb) {
    const thisCoords = XY(this.posX, this.posY);   
    const thisTile = board[thisCoords.x][thisCoords.y];
    const nextCoords = cb(thisCoords);
    const nextTile = board[nextCoords.x][nextCoords.y];
    if (nextTile && nextTile.color !== thisTile.color) {
      this.attackMoves.push([ nextCoords.x, nextCoords.y ]);
    }
  }

  calculateMoves(board) {
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    if (this.color === CHESS_COLORS.WHITE) {
      this.pawn_checkMoveRegular(board, this.moveUp);
      this.pawn_checkMoveAttack(board, this.moveUpLeft);
      this.pawn_checkMoveAttack(board, this.moveUpRight);
    }
    else if (this.color === CHESS_COLORS.BLACK) {
      this.pawn_checkMoveRegular(board, this.moveDown);
      this.pawn_checkMoveAttack(board, this.moveDownLeft);
      this.pawn_checkMoveAttack(board, this.moveDownRight);
    }

    

    /* 
    else if (nextTile && nextTile.color !== thisTile.color)
    {
      this.attackMoves.push([ nextCoords.x, nextCoords.y ]);
    } */

    /* if (this.color === CHESS_COLORS.WHITE) {
      // logic for white pawns
      this.regularMoves.push([ this.posX - 1, this.posY ]);
      if (this.posX === this.startPosX && this.posY === this.startPosY)
        this.regularMoves.push([ this.posX - 2, this.posY ]);      
    }
    else if (this.color === CHESS_COLORS.BLACK) {
      // logic for black pawns
      this.regularMoves.push([ this.posX + 1, this.posY ]);
      if (this.posX === this.startPosX && this.posY === this.startPosY)
        this.regularMoves.push([ this.posX + 2, this.posY ]);  
    } 
    else {
      console.log('Error: wrong color!');
    }    */
  }  
}

class Rook extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'Rook';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9814' : '&#9820';
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }


  calculateMoves(board) {
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    this.checkPath(board, this.moveUp);
    this.checkPath(board, this.moveDown);
    this.checkPath(board, this.moveLeft);
    this.checkPath(board, this.moveRight);

    /* // logic for white & black
    for (let i = 0; i < 8; i++) {
      if (i !== this.posX)
        this.regularMoves.push([ i, this.posY ]);
      if (i !== this.posY)
        this.regularMoves.push([ this.posX, i]);
    } */
  }
}

class Knight extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'Knight';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9816' : '&#9822';
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }

  calculateMoves(board) {
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    // actual logic
    const knightMoves = [];
    knightMoves.push(
      [this.posX + 2, this.posY - 1],
      [this.posX + 2, this.posY + 1],
      [this.posX - 2, this.posY - 1],
      [this.posX - 2, this.posY + 1],
      [this.posX + 1, this.posY - 2],
      [this.posX + 1, this.posY + 2],
      [this.posX - 1, this.posY - 2],
      [this.posX - 1, this.posY + 2]
    );
    knightMoves.forEach(m => {
      const coords = XY(m[0], m[1]);
      if (isWithinBound(coords)) {
        const targetTile = board[coords.x][coords.y];
        if (!targetTile) // target tile is empty)
          this.regularMoves.push([coords.x, coords.y]);
        else if (targetTile && targetTile.color !== this.color) // target tile has chess piece of oposite color
          this.attackMoves.push([coords.x, coords.y]);
      }
    });
  }
}

class Bishop extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'Bishop';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9815' : '&#9821';
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }

  calculateMoves(board) {    
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    this.checkPath(board, this.moveUpLeft);
    this.checkPath(board, this.moveUpRight);
    this.checkPath(board, this.moveDownLeft);
    this.checkPath(board, this.moveDownRight);


    /* 
    // up-left to down-right
    const diff = Math.min(this.posX, this.posY);    
    let x = this.posX - diff,
        y = this.posY - diff;
    while(x <= 7 && y <= 7) {
      if (x !== this.posX || y !== this.posY)      
        this.regularMoves.push([x, y]);
      x++; y++; 
   
    }

    // down-left to up-right
    x = this.posX + this.posY > 7 ? 7 : this.posX + this.posY,
    y = x === 7 ? (this.posX + this.posY) % 7 : 0;
    while(x >= 0 && y <= 7) { // stop when (x < 0 OR y > 7)
      if (x !== this.posX && y !== this.posY)
        this.regularMoves.push([x, y]);
      x--; y++;
    }
     */
  }
}

class King extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'King';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9812' : '&#9818'; 
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }

  calculateMoves(board) {
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


   /*  // actual logic for black & white
    const moves = [];
    for (let i = -1; i <= 1; i++) {
      moves.push( [this.posX + 1, this.posY + i] );
      moves.push( [this.posX - 1, this.posY + i] );
      moves.push( [this.posX, this.posY + i] );      
    }
    moves.forEach(m => {
      if (m[0] >= 0 && m[0] <= 7 && m[1] >= 0 && m[1] <= 7 && !(m[0] === this.posX && m[1] === this.posY))        
        this.regularMoves.push([m[0], m[1]]);
    }); */
  }
}

class Queen extends ChessPiece {
  constructor(color, posX, posY) {
    super(color, posX, posY);

    this.type = 'Queen';
    this.code = this.color === CHESS_COLORS.WHITE ? '&#9813' : '&#9819';
    this.id = this.type + STATIC_ID[this.type];
    STATIC_ID[this.type]++;
  }

  calculateMoves(board) {
    // clear old data (bad place to do it, I know)
    this.regularMoves.splice(0);
    this.attackMoves.splice(0);

    this.checkPath(board, this.moveUp);
    this.checkPath(board, this.moveDown);
    this.checkPath(board, this.moveLeft);
    this.checkPath(board, this.moveRight);
    this.checkPath(board, this.moveUpLeft);
    this.checkPath(board, this.moveUpRight);
    this.checkPath(board, this.moveDownLeft);
    this.checkPath(board, this.moveDownRight);    

    /* 
    // rook moves
    for (let i = 0; i < 8; i++) {
      if (i !== this.posX)
        this.regularMoves.push([ i, this.posY ]);
      if (i !== this.posY)
        this.regularMoves.push([ this.posX, i]);
    }
    // bishop moves
    const diff = Math.min(this.posX, this.posY);    
    let x = this.posX - diff,
        y = this.posY - diff;
    while(x <= 7 && y <= 7) {
      if (x !== this.posX || y !== this.posY)      
        this.regularMoves.push([x, y]);
      x++; y++;
    }

    x = this.posX + this.posY > 7 ? 7 : this.posX + this.posY,
    y = x === 7 ? (this.posX + this.posY) % 7 : 0;
    while(x >= 0 && y <= 7) { // stop when (x < 0 OR y > 7)
      if (x !== this.posX && y !== this.posY)
        this.regularMoves.push([x, y]);
      x--; y++;
    } */
  }
}



// initialize chess piece objects
const initChessPieces = () => {
  for (var e in STATIC_ID) {
    STATIC_ID[e] = 0;
  }
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

const generateChessColor = () => {
  const colorIndex = Math.floor(Math.random() * 2); // randomize player's color

  if (colorIndex === 0) {
    return CHESS_COLORS.WHITE;
  }

  return CHESS_COLORS.BLACK;
}

export { CHESS_COLORS, initChessPieces, generateChessColor };