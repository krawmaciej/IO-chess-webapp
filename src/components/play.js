import { auth } from '../firebase/firebase';

export default function Play() {
  return (
    <div>
      <p>Logged in as {auth().currentUser.email}</p>
      <iframe title="cb" width="1000" height="1000" src="chessboard.html"></iframe>
    </div>
  );
};
