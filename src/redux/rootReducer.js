import { combineReducers } from 'redux';
import { userReducer } from './userRedux/userReducer';
//import { nameOfReducer } from './folderName/reducerName';

//inside combine reducers name of imported reducers - combineReducers({nameOfReducer, nameOfReducer2});
export const rootReducer = combineReducers({ userReducer });
