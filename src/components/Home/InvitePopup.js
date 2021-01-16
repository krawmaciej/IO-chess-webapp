import Popup from 'reactjs-popup';
import './invite.css';

const invite = (showInvite, setShowInvite, acceptInvite, cancelInvite) => (
  <Popup
    open={showInvite}
    onClose={() => {
      setShowInvite(false);
      cancelInvite();
    }}
    modal
  >
    {close => (
      <div className="modal">
        <button className="close" onClick={close}>
          &times;
        </button>
        <div className="header"> Modal Title </div>
        <div className="content">
          {' '}
          You have been invited to a game!
        </div>
        <div className="actions">
          <button className="button" onClick={() => acceptInvite()}>
            Accept
          </button>
          <button className="button" onClick={() => close}>
            Cancel
          </button>
        </div>
      </div>
    )}
  </Popup>
);

export { invite };
