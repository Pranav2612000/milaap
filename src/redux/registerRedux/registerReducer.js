import {
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REDIRECT_TO_LOGIN,
  USERNAME_EXISTS
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
    default:
      console.log('def');
      return state;
  }
};
export default registerReducer;
