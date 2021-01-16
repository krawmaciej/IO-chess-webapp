import React from "react";
import { userCachedData } from '../../user/userData';
import Signed from "./Signed";
import NotSigned from "./NotSigned";
import { auth } from "../../firebase/firebase";

export default function Home() {
  return (
    <div>
      <div>
        <button onClick={SignOut}>Logout</button>
        {renderHome()}
      </div>
    </div>
  );
}

function renderHome() {
  if (userCachedData.isLoggedIn) {
    return <Signed />;
  } else {
    return <NotSigned />;
  }
}

// todo move to signed
function SignOut() {
  auth().signOut().then(() => {
    console.log('successful signout');
    // Sign-out successful.
  }).catch(console.log)
}