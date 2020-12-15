// global unique user state
export var userData = {
    isLoggedIn: false,
    uid: "",
    email: "",
    gameId: "",
    color: "",
    onAuthFinished: false
}

export const resetUserData = (data) => {
    data.isLoggedIn = false;
    data.uid = "";
    data.email = "";
    data.gameId = "";
    data.color = "";
    data.onAuthFinished = false;
}