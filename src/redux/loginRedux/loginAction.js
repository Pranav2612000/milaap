import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REDIRECT_TO_JOIN
} from './loginActionTypes';
import ReactNotification, { store } from 'react-notifications-component';
import axios from 'axios';

import Notifications, { success, error } from 'react-notification-system-redux';
/*
                store.addNotification({
                  title: 'Invalid Username or Password',
                  message: 'Please Try Again',
                  type: 'danger',
                  // insert: "top",
                  container: 'top-right',
                  animationIn: ['animated', 'fadeIn'],
                  animationOut: ['animated', 'fadeOut'],
                  dismiss: {
                    duration: 3000,
                    pauseOnHover: true
                  }
                });
                */

const notificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: 'Error',
  message: 'Invalid Username or Password',
  position: 'tr',
  autoDismiss: 2
};

export const loginRequest = () => {
  return {
    type: LOGIN_REQUEST
  };
};

export const loginSuccess = (username) => {
  return {
    type: LOGIN_SUCCESS,
    username: username
  };
};

export const loginFailure = (error) => {
  return {
    type: LOGIN_FAILURE,
    error: error
  };
};

export const redirectToJoinPage = () => {
  return {
    type: REDIRECT_TO_JOIN
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};

export const login = (username, password) => {
  console.log('loggin in...');
  var reqData = {
    username: username,
    password: password
  };
  return function (dispatch) {
    dispatch(loginRequest());
    axios
      .post(`${global.config.backendURL}/api/login`, reqData)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem('milaap-auth-token', res.data.token);
        localStorage.setItem('username', username);
        dispatch(loginSuccess(username));
      })
      .catch((err) => {
        dispatch(loginFailure(err));
        dispatch(Notifications.error(notificationOpts));
      });
  };
};

export const getTokenForTempUser = (reqData) => {
  return function (dispatch) {
    axios
      .post(`${global.config.backendURL}/api/user/gettokenfortempuser`, reqData)
      .then((res) => {
        localStorage.setItem('milaap-auth-token', res.data.token);
        localStorage.setItem('username', reqData.username);
        dispatch(loginSuccess(reqData.username));
      })
      .catch((err) => {
        dispatch(
          Notifications.error({
            title: 'Invalid Room',
            message: 'Room Not Found',
            position: 'tr',
            autoDismiss: 2
          })
        );
      });
  };
};
