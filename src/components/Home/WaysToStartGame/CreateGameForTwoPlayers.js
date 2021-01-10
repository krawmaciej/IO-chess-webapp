import { CHESS_COLORS, generateChessColor } from '../../../chess/chess';
import { database } from '../../../firebase/firebase';
import { userCachedData } from '../../../user/userData';

// TODO: game starts but you have to wait for other player to join
// if nobody yet joined the game can be cancelled
export const CreateGameForTwoPlayers = (enemyUID, changeUrlToJoinGame) => {
    const newGame = { // game state to be pushed into database
        whitePlayerUid: "",
        blackPlayerUid: "",
        activePlayerColor: CHESS_COLORS.WHITE,
        winner: "",
        moves: [] // array of moves made by each player, also used to load current state of the board
    };
    
    const enemyUserRef = database().ref("users").child(enemyUID); // enemy user db ref

    if (generateChessColor() === CHESS_COLORS.WHITE) {
      userCachedData.color = CHESS_COLORS.WHITE; // set active user color to white
      newGame.whitePlayerUid = userCachedData.uid; // make active user a white player on server

      enemyUserRef.child("color").set(CHESS_COLORS.BLACK); // set enemy user color to black
      newGame.blackPlayerUid = enemyUID; // make enemy user a black player on server
    } else {
      userCachedData.color = CHESS_COLORS.BLACK; // set active user color to black
      newGame.blackPlayerUid = userCachedData.uid; // make active user a black player on server

      enemyUserRef.child("color").set(CHESS_COLORS.WHITE); // set enemy user color to white
      newGame.whitePlayerUid = enemyUID; // make enemy user a white player on server
    }
  
    const gameRef = database().ref("games").push(); // create game on server
    userCachedData.gameId = gameRef.key; // set user gid

    const loggedUserRef = database().ref("users").child(userCachedData.uid);
    loggedUserRef.set(userCachedData); // update user data on database
    const enemyUserGIDRef = enemyUserRef.child("gameId");
    enemyUserGIDRef.set(gameRef.key); // update enemy gid on database


    gameRef.set(newGame).then(() => {
        changeUrlToJoinGame();
    }, (err) => {
        throw err;
    });
}
