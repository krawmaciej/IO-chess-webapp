import React, { useState, useEffect } from "react";
import { database } from "../../../firebase/firebase";
import { userCachedData } from "../../../user/userData";
import UserRow from "./UserRow";
// get list of active users

export default function ActiveUsers() {
  // holds list of logged in users
  const [activeUsersList, setActiveUsersList] = useState([]);

  // attach listener to database, update userlist on db change
  useEffect(() => {
    database().ref("users").on("value", data => {
      updateActiveUsersList(data.val());
    });
  }, []);

  function updateActiveUsersList(data) {
    const newList = parseUsersDataToList(data);
    setActiveUsersList(newList);
  }

  // map instead of foreach because javascript
  return (
    activeUsersSortedArray(activeUsersList).map((user, uniqueId) => {
      return <UserRow
              uid={user.uid}
              email={user.email}
              gameId={user.gameId}
              isLoggedIn={user.isLoggedIn}
              totalGamesPlayed={user.totalGamesPlayed}
              gamesWon={user.gamesWon}
            />;
    })
  );
}

function activeUsersSortedArray(activeUsersList) {
  var array = [];
  activeUsersList.map((user, uniqueId) => {
    const isNotThisUser = (userCachedData.uid === user.uid) ? false : true;
    const isLoggedIn = user.isLoggedIn;
    if (isNotThisUser && isLoggedIn) {
      array.push(user);
    }
  });

  return sortByTotalGamesAddVictories(array);
}

function sortByTotalGamesAddVictories(array) {
  array.sort(compareUsersByTotalAddWon);
  return array;
}

function compareUsersByTotalAddWon( a, b ) {
  if ( calculateWinRatio(a.gamesWon, a.totalGamesPlayed) < calculateWinRatio(b.gamesWon, b.totalGamesPlayed) ){
    return 1;
  }
  if ( calculateWinRatio(a.gamesWon, a.totalGamesPlayed) > calculateWinRatio(b.gamesWon, b.totalGamesPlayed) ){
    return -1;
  }
  return 0;
}

function calculateWinRatio(gamesWon, totalGamesPlayed) {
  if (totalGamesPlayed === 0) {
    return 0;
  }
  return Math.round(gamesWon/totalGamesPlayed * 100); 
}

function parseUsersDataToList(data) {
  var userList = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      const user = {
        uid: data[key].uid ? data[key].uid : "",
        email: data[key].email ? data[key].email : "",
        gameId: data[key].gameId ? data[key].gameId : "",
        isLoggedIn: data[key].isLoggedIn ? data[key].isLoggedIn : false,
        totalGamesPlayed: data[key].totalGamesPlayed ? data[key].totalGamesPlayed : 0,
        gamesWon: data[key].gamesWon ? data[key].gamesWon : 0
      }
      userList.push(user);
    }
  }
  return userList;
}
