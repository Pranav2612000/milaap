import {
  FETCH_USERS_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  TOGGLE_VIDEO,
  TOGGLE_AUDIO,
  SET_AUDIO_VIDEO_TO_INITIAL_STATE
} from './userActionTypes';

const initalUserState = {
  loading: false,
  users: [],
  error: '',
  video: true,
  audio: true
};

const userReducer = (state = initalUserState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: ''
      };
    case FETCH_USERS_FAILURE:
      return {
        loading: false,
        users: [],
        error: action.payload
      };
    case TOGGLE_VIDEO:
      return {
        ...state,
        video: !state.video
      };
    case TOGGLE_AUDIO:
      return {
        ...state,
        audio: !state.audio
      };
    case SET_AUDIO_VIDEO_TO_INITIAL_STATE:
      return {
        ...state,
        audio: true,
        video: true
      };
    default:
      return state;
  }
};

export default userReducer;
