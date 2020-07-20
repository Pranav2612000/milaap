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

export const enterRoomRequest = () => ({
  type: ENTER_ROOM_REQUEST
});

export const enterRoomSuccess = (room, roomObj) => ({
  type: ENTER_ROOM_SUCCESS,
  currentRoom: room,
  msgs: roomObj.msgs,
  users: roomObj.users,
  guests: roomObj.guests
});

export const enterRoomFailure = (error) => ({
  type: ENTER_ROOM_FAILURE,
  error: error
});

export const enterRoom = (room) => async (dispatch) => {
  const reqData = { roomName: room };
  dispatch(enterRoomRequest());
  try {
    const res = await axios.post(
      `${global.config.backendURL}/api/room/enterroom`,
      reqData,
      {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      }
    );
    if (res.data.err === 'UEXISTS') {
      localStorage.removeItem('milaap-auth-token');
      dispatch(redirectToJoinPage());
      dispatch(enterRoomFailure('UEXISTS'));
    } else if (res.data.err === 'NOROOM') {
      dispatch(enterRoomFailure('NOROOM'));
    } else {
      dispatch(enterRoomSuccess(reqData.roomName, res.data));
    }
  } catch (err) {
    dispatch(enterRoomFailure(err));
    dispatch(Notifications.error(notificationOpts));
  }
};
