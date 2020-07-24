import {
  ENTER_ROOM_REQUEST,
  ENTER_ROOM_SUCCESS,
  ENTER_ROOM_FAILURE,
  LEAVE_ROOM
} from './roomActionTypes';
import { redirectToJoinPage } from '../loginRedux/loginAction';
import axios from 'axios';
import Notifications from 'react-notification-system-redux';

const errorNotificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: 'Error',
  message: 'Please try again with a different username',
  position: 'tr',
  autoDismiss: 2
};

export const enterRoomRequest = () => ({
  type: ENTER_ROOM_REQUEST
});

export const leaveRoom = () => ({
  type: LEAVE_ROOM
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
  error
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

    dispatch(enterRoomSuccess(reqData.roomName, res.data));
  } catch (err) {
    if (err.reponse.data.err === 'UEXISTS') {
      localStorage.removeItem('milaap-auth-token');
      dispatch(redirectToJoinPage());
      dispatch(enterRoomFailure('UEXISTS'));
    } else if (err.reponse.data.err === 'NOROOM') {
      dispatch(enterRoomFailure('NOROOM'));
    } else {
      dispatch(enterRoomFailure(err));
      dispatch(Notifications.error(errorNotificationOpts));
    }
  }
};

export const deleteRoom = (room) => async (dispatch) => {
  const reqData = { roomName: room };
  try {
    await axios.delete(`${global.config.backendURL}/api/room/`, {
      headers: {
        'milaap-auth-token': localStorage.getItem('milaap-auth-token')
      },
      data: reqData
    });
    dispatch(leaveRoom());
  } catch (err) {
    throw err;
  }
};
