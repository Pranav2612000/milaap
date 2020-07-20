import { INCREASE_COUNT, RESET_COUNT } from './messageActionTypes';

export const increaseMessageCount = (roomName) => ({
  type: INCREASE_COUNT,
  room: roomName
});
export const resetMessageCount = (roomName) => ({
  type: RESET_COUNT,
  room: roomName
});
