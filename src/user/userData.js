// global unique user state
const userCachedData = {
    isLoggedIn: false,
    uid: "",
    email: "",
    gameId: "",
    color: "",
    gamesWon: 0,
    totalGamesPlayed: 0
}

const isPlayerInGame = () => {
    return (userCachedData.gameId === "") ? false : true;
}

function getUsername(email) {
  return email.substring(0, email.lastIndexOf("@"));
}

const resetUserData = (data) => {
    data.isLoggedIn = false;
    data.uid = "";
    data.email = "";
    data.gameId = "";
    data.color = "";
    data.gamesWon = 0;
    data.totalGamesPlayed = 0;
}

const loadUserDataFromServer = (user, dataFromServer) => {
    user.isLoggedIn = dataFromServer.isLoggedIn;
    user.uid = dataFromServer.uid;
    user.email = dataFromServer.email;
    user.gameId = dataFromServer.gameId;
    user.color = dataFromServer.color;

    user.gamesWon = dataFromServer.gamesWon ? dataFromServer.gamesWon : 0;
    user.totalGamesPlayed = dataFromServer.totalGamesPlayed ? dataFromServer.totalGamesPlayed : 0;
}

export { userCachedData, isPlayerInGame, resetUserData, loadUserDataFromServer, getUsername };
