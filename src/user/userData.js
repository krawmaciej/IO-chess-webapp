// global unique user state
const userCachedData = {
    isLoggedIn: false,
    uid: "",
    email: "",
    gameId: "",
    color: ""
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
}

const loadUserDataFromServer = (user, dataFromServer) => {
    user.isLoggedIn = dataFromServer.isLoggedIn;
    user.uid = dataFromServer.uid;
    user.email = dataFromServer.email;
    user.gameId = dataFromServer.gameId;
    user.color = dataFromServer.color;
}

export { userCachedData, isPlayerInGame, resetUserData, loadUserDataFromServer, getUsername };
