import * as constant from "./constant.js";

let state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingStream: null,
  allowConnectionsFromStrangers: false,
  screenSharingActive: false,
  callState: constant.state.CALL_AVAILABLE_ONLY_CHAT,
};

export const setSocketId = (socketId) => {
  state = {
    ...state,
    socketId,
  };
};

export const setLocalStream = (localStream) => {
  state = {
    ...state,
    localStream,
  };
};

export const setRemoteStream = (remoteStream) => {
  state = {
    ...state,
    remoteStream,
  };
};

export const setAllowConnectionsFromStrangers = (
  allowConnectionsFromStrangers
) => {
  state = {
    ...state,
    allowConnectionsFromStrangers,
  };
};

export const setScreenSharingActive = (screenSharingActive) => {
  state = {
    ...state,
    screenSharingActive,
  };
};

export const setScreenSharingStream = (screenSharingStream) => {
  state = {
    ...state,
    screenSharingStream,
  };
};

export const setCallState = (callState) => {
  state = {
    ...state,
    callState,
  };
};

export const getState = () => {
  return state;
};
