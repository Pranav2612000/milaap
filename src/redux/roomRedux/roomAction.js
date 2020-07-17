import {
  ENTER_ROOM_REQUEST,
  ENTER_ROOM_SUCCESS,
  ENTER_ROOM_FAILURE
} from './roomActionTypes';
import { redirectToJoinPage } from '../loginRedux/loginAction';
import axios from 'axios';
import Notifications from 'react-notification-system-redux';

const notificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: 'Error',
  message: 'Please try again with a different username',
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
  var reqData = {
    roomName: room
  };
  return function (dispatch) {
    dispatch(enterRoomRequest());
    axios
      .post(`${global.config.backendURL}/api/room/enterroom`, reqData, {
        headers: {
          'milaap-auth-token': global.config.secureStorage.getItem(
            'milaap-auth-token'
          )
        }
      })
      .then((res) => {
        if (res.data.err == 'UEXISTS') {
          global.config.secureStorage.removeItem('milaap-auth-token');
          dispatch(redirectToJoinPage());
          dispatch(enterRoomFailure('UEXISTS'));
          return;
        }
        if (res.data.err == 'NOROOM') {
          dispatch(enterRoomFailure('NOROOM'));
          return;
        }
        dispatch(enterRoomSuccess(reqData.roomName, res.data));
        console.clear();
        console.log(res.data);
      })
      .catch((err) => {
        dispatch(enterRoomFailure(err));
        dispatch(Notifications.error(notificationOpts));
      });
  };
};
