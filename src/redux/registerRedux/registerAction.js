import {
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  USERNAME_EXISTS
} from './registerActionTypes';
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
const unameNotificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: 'Error',
  message: 'You are late! Username already exists, choose a different username.',
  position: 'tr',
  autoDismiss: 3
};

const failureNotificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: 'Oops',
  message: 'Some Error Occured ! Try Again !',
  position: 'tr',
  autoDismiss: 3
};
export const registerRequest = () => {
  return {
    type: REGISTER_REQUEST
  };
};
export const usernameExists = (error) => {
  return {
    type: USERNAME_EXISTS,
    error: error
  };
};
export const registerSuccess = () => {
  return {
    type: REGISTER_SUCCESS
  };
};

export const registerFailure = (error) => {
  return {
    type: REGISTER_FAILURE,
    error: error
  };
};

export const register = (username, password) => {
  console.log('registering....');
  var reqData = {
    username: username,
    password: password
  };
  return function (dispatch) {
    dispatch(registerRequest());

    axios
      .post(`${global.config.backendURL}/api/register/`, reqData)
      .then((res) => {
        console.log(res);
        if (res.data.err == 'UEXIST') {
          console.log('username exists');
          dispatch(usernameExists(res.data.err));
          dispatch(Notifications.error(unameNotificationOpts));
          return;
        }
        dispatch(registerSuccess());
      })
      .catch((err) => {
        console.log(err);
        dispatch(registerFailure(err));
        dispatch(Notifications.error(failureNotificationOpts));
      });
  };
};
