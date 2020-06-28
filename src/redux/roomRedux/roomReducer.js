import {
  ENTER_ROOM_REQUEST,
  ENTER_ROOM_SUCCESS,
  ENTER_ROOM_FAILURE
} from './roomActionTypes';

const initalState = {
  loading: false
};

export const roomReducer = (state = initalState, action) => {
  switch (action.type) {
    case ENTER_ROOM_REQUEST:
      return {
        ...state,
        loading: true,
        currentRoom: undefined,
        msgs: undefined,
        users: undefined,
        guests: undefined
      };
    case ENTER_ROOM_SUCCESS:
      return {
        ...state,
        // loading: false,
        currentRoom: action.currentRoom,
        msgs: action.msgs,
        users: action.users,
        guests: action.guests
      };
    case ENTER_ROOM_FAILURE:
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
export default roomReducer;
