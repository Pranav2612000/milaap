import {
  FETCH_USERS_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  TOGGLE_VIDEO,
  TOGGLE_AUDIO
} from './userActionTypes';

const initalState = {
  loading: false,
  users: [],
  error: '',
  video: true,
  audio: true
};

export const userReducer = (state = initalState, action) => {
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
    default:
      return state;
  }
};
