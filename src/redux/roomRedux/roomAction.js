import {
  ENTER_ROOM_REQUEST,
  ENTER_ROOM_SUCCESS,
  ENTER_ROOM_FAILURE
} from './roomActionTypes';
import { redirectToJoinPage } from '../loginRedux/loginAction';
import axios from 'axios';
import Notifications, { success, error } from 'react-notification-system-redux';

const notificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: 'Error',
  message: 'Could not enter room! Please try again.',
  position: 'tr',
  autoDismiss: 2
};

export const enterRoomRequest = () => {
  return {
    type: ENTER_ROOM_REQUEST
  };
};

export const enterRoomSuccess = (room, roomObj) => {
  return {
    type: ENTER_ROOM_SUCCESS,
    currentRoom: room,
    msgs: roomObj.msgs,
    users: roomObj.users,
    guests: roomObj.guests
  };
};

export const enterRoomFailure = (error) => {
  return {
    type: ENTER_ROOM_FAILURE,
    error: error
  };
};

export const enterRoom = (room) => {
  console.log('Entering Room...');
  var reqData = {
    roomName: room
  };
  return function (dispatch) {
    dispatch(enterRoomRequest());
    axios
      .post(`${global.config.backendURL}/api/room/enterroom`, reqData, {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.err == 'UEXISTS') {
          console.log(
            'Someone with the same username already exists. Change your username and try again.'
          );
          localStorage.removeItem('milaap-auth-token');
          dispatch(redirectToJoinPage());
          dispatch(enterRoomFailure('UEXISTS'));
          return;
        }
        if (res.data.err == 'NOROOM') {
          dispatch(enterRoomFailure('NOROOM'));
          return;
        }
        localStorage.setItem('room', reqData.roomName);
        dispatch(enterRoomSuccess(reqData.roomName, res.data));
      })
      .catch((err) => {
        dispatch(enterRoomFailure(err));
        dispatch(Notifications.error(notificationOpts));
      });
  };
};
