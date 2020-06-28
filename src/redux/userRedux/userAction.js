import {
  FETCH_USERS_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  TOGGLE_VIDEO,
  TOGGLE_AUDIO
} from './userActionTypes';
import axios from 'axios';
import { loginSuccess } from '../loginRedux/loginAction';
import Notifications, { success, error } from 'react-notification-system-redux';
export const fetchUserRequest = () => {
  return {
    type: FETCH_USERS_REQUEST
  };
};

export const fetchUserSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users
  };
};

export const fetchUserFailuer = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error
  };
};
export const toggleVideo = () => {
  return {
    type: TOGGLE_VIDEO
  };
};
export const toggleAudio = () => {
  return {
    type: TOGGLE_AUDIO
  };
};
export const fetchUsers = () => {
  console.log('Called');
  return function (dispatch) {
    dispatch(fetchUserRequest());
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        console.log(res.data);
        dispatch(fetchUserSuccess(res.data.map((user) => user.name)));
      })
      .catch((err) => {
        dispatch(fetchUserFailuer(err));
      });
  };
};
