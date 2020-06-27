import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REDIRECT_TO_JOIN
} from './loginActionTypes';

const initalState = {
  loading: false,
  username:
    localStorage.getItem('username') == null
      ? undefined
      : localStorage.getItem('username')
};

export const loginReducer = (state = initalState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      console.log('login');
      return {
        ...state,
        loading: true
      };
    case LOGIN_SUCCESS:
      console.log('loggedin');
      return {
        ...state,
        loading: false,
        loggedIn: true,
        username: action.username,
        guest: action.guest
      };
    case LOGIN_FAILURE:
      console.log('fail');
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case LOGOUT:
      console.log('logout');
      return {
        ...state,
        loggedIn: false
      };
    case REDIRECT_TO_JOIN:
      console.log('redirecting to join page.');
      return {
        ...state,
        loading: false,
        loggedIn: false,
        redirectToJoin: true
      };
    default:
      console.log('def');
      return state;
  }
};
export default loginReducer;
