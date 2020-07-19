import {
  ENTER_ROOM_REQUEST,
  ENTER_ROOM_SUCCESS,
  ENTER_ROOM_FAILURE
} from './roomActionTypes';

const initalRoomState = {
  loading: false,
  guests: []
};

const roomReducer = (state = initalRoomState, action) => {
  switch (action.type) {
    case ENTER_ROOM_REQUEST:
      return {
        ...state,
        loading: true,
        currentRoom: undefined,
        msgs: undefined,
        users: undefined,
        guests: undefined,
        error: null
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
      return state;
  }
};
export default roomReducer;
