import {
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  USERNAME_EXISTS,
  GOOGLE_USER
} from './registerActionTypes';
import axios from 'axios';
import Notifications from 'react-notification-system-redux';
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
export const registerRequest = () => ({
  type: REGISTER_REQUEST
});
export const usernameExists = (error) => ({
  type: USERNAME_EXISTS,
  error: error
});
export const registerSuccess = () => ({
  type: REGISTER_SUCCESS
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  error: error
});

export const googleUser = () => ({
  type: GOOGLE_USER
});

export const register = (username, password, google = false) => async (dispatch) => {
  const reqData = { username, password };
  dispatch(registerRequest());
  try {
    await axios.post(`${global.config.backendURL}/api/register/`, reqData);
    dispatch(registerSuccess());
  } catch (err) {
    if (err.response?.data?.err === 'UEXIST' && google === true) {
      dispatch(googleUser());
    } else if (err.response?.data?.err === 'UEXIST') {
      dispatch(usernameExists(err.response.data.err));
      dispatch(Notifications.error(unameNotificationOpts));
    } else {
      dispatch(registerFailure(err));
      dispatch(Notifications.error(failureNotificationOpts));
    }
  }
};
