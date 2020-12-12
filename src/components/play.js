import { auth } from '../firebase/firebase';
import './play.css';

export default function Play() {
  return (
    <div class="board">
      <p>Logged in as {auth().currentUser.email}</p>
      <iframe title="cb" width="1200" height="1200" src="chessboard.html"></iframe>
    </div>
  );
};
