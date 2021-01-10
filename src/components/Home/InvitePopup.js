import Popup from 'reactjs-popup';
import './invite.css';

const invite = (showInvite, setShowInvite) => (
  <Popup
    open={showInvite}
    onClose={() => setShowInvite(false)}
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
          Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
          delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?
          <br />
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
          commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
          explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae?
        </div>
        <div className="actions">
          <button className="button"> Trigger </button>
          <button className="button" onClick={close}>
            close modal
          </button>
        </div>
      </div>
    )}
  </Popup>
);

export { invite };
