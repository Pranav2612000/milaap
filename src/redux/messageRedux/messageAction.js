import { INCREASE_COUNT, RESET_COUNT } from './messageActionTypes';

export const increaseMessageCount = (roomName) => {
  return {
    type: INCREASE_COUNT,
    room: roomName
  };
};
export const resetMessageCount = (roomName) => {
  return {
    type: RESET_COUNT,
    room: roomName
  };
};
