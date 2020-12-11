import { auth } from '../firebase/firebase';

export default function Play() {
  return (
    <div id="game">
      <div id="gamepanel">
        <div class="loggeduser">Logged in as <span class="bold">{auth().currentUser.email}</span></div>
        <br />
        <form id="gamesettings">
                  <p class="bold upline">Opcje:</p>
                  <label for="rank">Gra rankingowa</label>
          <br />
          <input type="checkbox"></input>
        </form>
      </div>

      <div id="gameboard">
        <iframe id="frame" title="cb" src="chessboard.html"></iframe>
      </div>

    </div>
  );
};
