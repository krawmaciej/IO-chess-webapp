import Popup from 'reactjs-popup';
import './invite.css';


// TODO: add player username
const invite = (showInvite, setShowInvite, invitorUsername, inviteKey, acceptInvite, cancelInvite) => (
  <Popup
    open={showInvite}
    onClose={() => {
      cancelInvite(inviteKey);
      setShowInvite(false);
    }}
    modal
  >
    {close => (
      <div className="modal">
        <div className="header">Invitation</div>
        <div className="content">
          {' '}
          You have been invited to a game by {invitorUsername}!
        </div>
        <div className="actions">
          <button className="button" onClick={() => {
              acceptInvite(inviteKey);
              setShowInvite(false);
            }}>
            Accept
          </button>
          <button className="button" onClick={() => close()}>
            Reject
          </button>
        </div>
      </div>
    )}
  </Popup>
);

export { invite };
