import { combineReducers } from 'redux';
import { reducer as notifications } from 'react-notification-system-redux';
import { userReducer } from './userRedux/userReducer';
import { loginReducer } from './loginRedux/loginReducer';
import { roomReducer } from './roomRedux/roomReducer';
import { registerReducer } from './registerRedux/registerReducer'; // Reducers
import { appReducer } from './app';
import { searchReducer } from './search';
import { videoPlayerReducer } from './videoPlayer';
import { userReducer as user } from './user';
import { videoListReducer } from './videoList';
import { partyReducer } from './party';
//import { nameOfReducer } from './folderName/reducerName';

//inside combine reducers name of imported reducers - combineReducers({nameOfReducer, nameOfReducer2});
export const rootReducer = combineReducers({
  notifications,
  userReducer,
  loginReducer,
  roomReducer,
  registerReducer,
  app: appReducer,
  videoPlayer: videoPlayerReducer,
  videoList: videoListReducer,
  search: searchReducer,
  party: partyReducer,
  user: user
});
