import { CHESS_COLORS } from '../../../chess/chess';
import { database } from '../../../firebase/firebase';
import { userCachedData } from '../../../user/userData';

// TODO: game starts but you have to wait for other player to join
// if nobody yet joined the game can be cancelled
export const JoinGame = (changeUrlToJoinGame) => {
    const newGame = { // game state to be pushed into database
        whitePlayerUid: "",
        blackPlayerUid: "",
        activePlayerColor: CHESS_COLORS.WHITE,
        winner: "",
        moves: [] // array of moves made by each player, also used to load current state of the board
    };
  
    newGame.whitePlayerUid = userCachedData.uid; // make player a white player
    userCachedData.color = CHESS_COLORS.WHITE; // set player color to white
  
    const gameRef = database().ref("games").push();
    userCachedData.gameId = gameRef.key; // set user gid

    const loggedUserRef = database().ref("users").child(userCachedData.uid);
    loggedUserRef.set(userCachedData); // update user data on database

    gameRef.set(newGame).then(() => {
        changeUrlToJoinGame();
    }, (err) => {
        throw err;
    });
}
