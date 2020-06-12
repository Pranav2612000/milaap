import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import io from 'socket.io-client';
import createSocketIoMiddleware from 'redux-socket.io';
import { WEBSOCKET_URL } from '../core/constants';

// Reducers

// Initialize constants
const socket = io(WEBSOCKET_URL);

// Initialize redux-socket-io middleware
// NOTE: All redux actions prefixed with 'WS_TO_SERVER_' will automatically ALSO be emitted
// 			 over websockets to the backend
const socketIoMiddleware = createSocketIoMiddleware(socket, 'WS_TO_SERVER_');

// Apply middlewares and initialize store

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware, socketIoMiddleware))
);
