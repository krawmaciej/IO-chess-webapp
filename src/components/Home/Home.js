import Signed from "./Signed";
import NotSigned from "./NotSigned";
import { userCachedData } from '../../user/userData';

export default function Home() {
  return (
    <div>
      <div>
        <h1>Home</h1>
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
