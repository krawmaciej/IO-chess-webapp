// global unique user state
export const userCachedData = {
    isLoggedIn: false,
    uid: "",
    email: "",
    gameId: "",
    color: ""
}

export const resetUserData = (data) => {
    data.isLoggedIn = false;
    data.uid = "";
    data.email = "";
    data.gameId = "";
    data.color = "";
}

export const loadUserDataFromServer = (user, dataFromServer) => {
    user.isLoggedIn = dataFromServer.isLoggedIn;
    user.uid = dataFromServer.uid;
    user.email = dataFromServer.email;
    user.gameId = dataFromServer.gameId;
    user.color = dataFromServer.color;
}
