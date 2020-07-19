import { INCREASE_COUNT, RESET_COUNT } from './messageActionTypes';

const initalMessageState = {
  count: {}
};

const messageReducer = (state = initalMessageState, action) => {
  const newCount = { ...state.count };
  switch (action.type) {
    case INCREASE_COUNT:
      const num = state.count[action.room] ? state.count[action.room] + 1 : 1;
      newCount[action.room] = num;
      return {
        ...state,
        count: newCount
      };
    case RESET_COUNT:
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
