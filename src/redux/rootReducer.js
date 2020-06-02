import { combineReducers } from 'redux';
import {reducer as notifications} from 'react-notification-system-redux';
import { userReducer } from './userRedux/userReducer';
import { loginReducer } from './loginRedux/loginReducer';
import { roomReducer } from './roomRedux/roomReducer';
//import { nameOfReducer } from './folderName/reducerName';

//inside combine reducers name of imported reducers - combineReducers({nameOfReducer, nameOfReducer2});
export const rootReducer = combineReducers({ 
  notifications,
  userReducer, 
  loginReducer,
  roomReducer
});
