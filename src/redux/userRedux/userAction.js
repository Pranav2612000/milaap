import {
  FETCH_USERS_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  TOGGLE_VIDEO,
  TOGGLE_AUDIO,
  SET_AUDIO_VIDEO_TO_INITIAL_STATE
} from './userActionTypes';
import axios from 'axios';

export const fetchUserRequest = () => ({
  type: FETCH_USERS_REQUEST
});

export const fetchUserSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS
});

export const fetchUserFailuer = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: error
});
export const toggleVideo = () => ({
  type: TOGGLE_VIDEO
});
export const toggleAudio = () => ({
  type: TOGGLE_AUDIO
});
export const setAudioVideoToInitialState = () => ({
  type: SET_AUDIO_VIDEO_TO_INITIAL_STATE
});
export const fetchUsers = () => async (dispatch) => {
  dispatch(fetchUserRequest());
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    dispatch(fetchUserSuccess(res.data.map((user) => user.name)));
  } catch (err) {
    dispatch(fetchUserFailuer(err));
  }
};
