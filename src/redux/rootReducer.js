import { combineReducers } from 'redux';
import { reducer as notifications } from 'react-notification-system-redux';
import userReducer from './userRedux/userReducer';
import loginReducer from './loginRedux/loginReducer';
import roomReducer from './roomRedux/roomReducer';
import registerReducer from './registerRedux/registerReducer';
import messageReducer from './messageRedux/messageReducer';
export default combineReducers({
  notifications,
  userReducer,
  loginReducer,
  roomReducer,
  registerReducer,
  messageReducer
});
