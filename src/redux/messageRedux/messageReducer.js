import { INCREASE_COUNT, RESET_COUNT } from './messageActionTypes';

const initalState = {
  count: {}
};

export const messageReducer = (state = initalState, action) => {
  switch (action.type) {
    case INCREASE_COUNT:
      var num = state.count[action.room] ? state.count[action.room] + 1 : 1;
      var newCount = { ...state.count };
      newCount[action.room] = num;
      return {
        ...state,
        count: newCount
      };
    case RESET_COUNT:
      var newCount = { ...state.count };
      newCount[action.room] = 0;
      return {
        ...state,
        count: newCount
      };
    default:
      return state;
  }
};
export default messageReducer;
