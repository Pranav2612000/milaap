import { combineReducers } from 'redux';
import { reducer as notifications } from 'react-notification-system-redux';
import { userReducer } from './userRedux/userReducer';
import { loginReducer } from './loginRedux/loginReducer';
import { roomReducer } from './roomRedux/roomReducer';
import { registerReducer } from './registerRedux/registerReducer';

export const rootReducer = combineReducers({
  notifications,
  userReducer,
  loginReducer,
  roomReducer,
  registerReducer
});
