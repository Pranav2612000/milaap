import {
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  USERNAME_EXISTS,
  GOOGLE_USER
} from './registerActionTypes';

const initalState = {
  loading: false
};

export const registerReducer = (state = initalState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      console.log('register');
      return {
        ...state,
        loading: true
      };
    case REGISTER_SUCCESS:
      console.log('registered');
      return {
        ...state,
        loading: false,
        registered: true
      };
    case REGISTER_FAILURE:
      console.log('signUp falied');
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case USERNAME_EXISTS:
      console.log('username exists');
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case GOOGLE_USER:
      console.log('Google user in db');
      return {
        ...state,
        loading: false,
        glogin: true
      };
    default:
      console.log('def');
      return state;
  }
};
export default registerReducer;
