// global unique user state
export var userCachedData = {
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

export const loadUserDataFromServer = (user, onServer) => {
    user.isLoggedIn = onServer.isLoggedIn;
    user.uid = onServer.uid;
    user.email = onServer.email;
    user.gameId = onServer.gameId;
    user.color = onServer.color;
}
