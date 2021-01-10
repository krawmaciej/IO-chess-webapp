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
        activeUsersList.map((user, uniqueId) => {
          const isNotThisUser = (userCachedData.uid === user.uid) ? false : true;
          const isLoggedIn = user.isLoggedIn;
          if (isNotThisUser && isLoggedIn) {
            return <UserRow uid={user.uid} email={user.email} gameId={user.gameId} isLoggedIn={user.isLoggedIn}/>;
          }
          return null;
        })
  );
}

function parseUsersDataToList(data) {
  var userList = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      const user = {
        uid: data[key].uid,
        email: data[key].email,
        gameId: data[key].gameId,
        isLoggedIn: data[key].isLoggedIn
      }
      userList.push(user);
    }
  }
  console.log("users data: ", userList);
  return userList;
}
