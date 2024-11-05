import * as wss from "./wss.js";
import * as constant from "./constant.js";
import * as ui from "./ui.js";
import * as store from "./store.js";

let connectedUserDetails;
let peerConnection;
let dataChannel;

const mediaConstraints = {
  audio: true,
  video: true,
};

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(mediaConstraints)
    .then((stream) => {
      ui.updateLocalVideo(stream);
      store.setLocalStream(stream);
      store.setCallState(constant.state.CALL_AVAILABLE);
      ui.showVideoCallButtons();
    })
    .catch((error) => {
      console.log(error);
    });
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);
  dataChannel = peerConnection.createDataChannel("chat");

  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      ui.appendMessage(message, false);
    };
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      //send ice candidate to peer
      wss.sendDataUsingWebRTC({
        type: constant.webRTCSignaling.ICECANDIDATE,
        offer: event.candidate,
        callerId: connectedUserDetails.socketId,
      });
    }
  };

  peerConnection.onconnectionstatechange = (event) => {
    if (peerConnection.connectionState === "connected") {
    }
  };

  //receiving track from peer
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);
  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  //add our stream to peer
  if (
    connectedUserDetails.callType === constant.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === constant.callType.VIDEO_STRANGER
  ) {
    const localStream = store.getState().localStream;
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

//data channel events for chat
export const sendMessageUsingDataChannel = (message) => {
  const stringifyMessage = JSON.stringify(message);
  dataChannel.send(stringifyMessage);
};

export const sendPreOffer = (callerId, callType) => {
  connectedUserDetails = {
    socketId: callerId,
    callType,
  };

  if (
    callType === constant.callType.CHAT_PERSONAL_CODE ||
    callType === constant.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callerId,
      callType,
    };

    wss.sendPreOffer(data);
    store.setCallState(constant.state.CALL_UNAVAILABLE);
    ui.showCallingDialog(callingRejectCallHandler);
  } else if (
    callType === constant.callType.CHAT_STRANGER ||
    callType === constant.callType.VIDEO_STRANGER
  ) {
    const data = {
      callerId,
      callType,
    };
    store.setCallState(constant.state.CALL_UNAVAILABLE);
    wss.sendPreOffer(data);
  }
};

export const handlePreOffer = (data) => {
  const { callerId, callType } = data;

  if (!checkCallPossibility(callType)) {
    return sendPreOfferAnswer(
      constant.preOfferAnswerType.CALL_UNAVAILABLE,
      callerId
    );
  }

  connectedUserDetails = {
    socketId: callerId,
    callType,
  };
  store.setCallState(constant.state.CALL_UNAVAILABLE);
  if (
    callType === constant.callType.CHAT_PERSONAL_CODE ||
    callType === constant.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  } else if (
    callType === constant.callType.CHAT_STRANGER ||
    callType === constant.callType.VIDEO_STRANGER
  ) {
    createPeerConnection();
    sendPreOfferAnswer(constant.preOfferAnswerType.ACCEPTED, callerId);
    ui.showCallElements(connectedUserDetails.callType);
  }
};

export const handlePreOfferAnswer = (data) => {
  ui.removeCallDialogs();
  const { preOfferAnswer } = data;
  if (preOfferAnswer === constant.preOfferAnswerType.CALLEE_NOT_FOUND) {
    //show dialog callee not found
    ui.showInfoDialog(preOfferAnswer);
    setCallAvailabitlity();
  } else if (preOfferAnswer === constant.preOfferAnswerType.CALL_UNAVAILABLE) {
    // show dialog call unavailable
    ui.showInfoDialog(preOfferAnswer);
    setCallAvailabitlity();
  } else if (preOfferAnswer === constant.preOfferAnswerType.REJECTED) {
    // show dialog rejected
    ui.showInfoDialog(preOfferAnswer);
    setCallAvailabitlity();
  } else if (preOfferAnswer === constant.preOfferAnswerType.ACCEPTED) {
    ui.showCallElements(connectedUserDetails.callType);
    createPeerConnection();
    sendWebRTCOffer();
  }
};

const sendPreOfferAnswer = (
  preOfferAnswer,
  callerId = connectedUserDetails.socketId
) => {
  const data = {
    callerId,
    preOfferAnswer,
  };
  ui.removeCallDialogs();
  wss.sendPreOfferAnswer(data);
};

const acceptCallHandler = () => {
  sendPreOfferAnswer(constant.preOfferAnswerType.ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
  createPeerConnection();
};
const rejectCallHandler = () => {
  setCallAvailabitlity();
  sendPreOfferAnswer(constant.preOfferAnswerType.REJECTED);
};

const callingRejectCallHandler = () => {
  const data = {
    callerId: connectedUserDetails.socketId,
  };
  closePeerConnectionAndResetState();
  wss.sendUserHangUp(data);
};

const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  wss.sendDataUsingWebRTC({
    callerId: connectedUserDetails.socketId,
    type: constant.webRTCSignaling.OFFER,
    offer: offer,
  });
};

export const handleWebRTCOffer = async (data) => {
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  wss.sendDataUsingWebRTC({
    callerId: connectedUserDetails.socketId,
    type: constant.webRTCSignaling.ANSWER,
    offer: answer,
  });
};

export const handleWebRTCAnswer = async (data) => {
  await peerConnection.setRemoteDescription(data.offer);
};

export const handleWebRTCCandidate = async (data) => {
  try {
    await peerConnection.addIceCandidate(data.offer);
  } catch (error) {
    console.log(error);
  }
};

let screenSharingStream;

export const switchBetweenCameraAndScreenSharing = async (
  screenSharingActive
) => {
  if (screenSharingActive) {
    try {
      ui.toggleVideoMirror("local_video");
      const localStream = store.getState().localStream;
      const senders = peerConnection.getSenders();
      const sender = senders.find(
        (sender) => sender.track.kind === localStream.getVideoTracks()[0].kind
      );
      if (sender) sender.replaceTrack(localStream.getVideoTracks()[0]);
      store
        .getState()
        .screenSharingStream.getTracks()
        .forEach((track) => {
          track.stop();
        });
      store.setScreenSharingActive(false);
      ui.updateLocalVideo(localStream);
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      ui.toggleVideoMirror("local_video");
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      store.setScreenSharingStream(screenSharingStream);
      //replace local stream with screen sharing stream
      const senders = peerConnection.getSenders();
      const sender = senders.find(
        (sender) =>
          sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
      );
      if (sender) sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      store.setScreenSharingActive(true);
      ui.updateLocalVideo(screenSharingStream);
    } catch (error) {
      console.log(error);
    }
  }
};

//hang up
export const handleHangUp = () => {
  const data = {
    callerId: connectedUserDetails.socketId,
  };
  wss.sendUserHangUp(data);
  closePeerConnectionAndResetState();
};

export const handleConnectedUserHangUp = () => {
  closePeerConnectionAndResetState();
};

const closePeerConnectionAndResetState = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  //active camera and mic
  if (
    connectedUserDetails.callType === constant.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === constant.callType.VIDEO_STRANGER
  ) {
    store.getState().localStream.getVideoTracks()[0].enabled = true;
    store.getState().localStream.getAudioTracks()[0].enabled = true;
  }
  ui.updateAfterHangUp(connectedUserDetails.callType);
  setCallAvailabitlity();
  connectedUserDetails = null;
};

const checkCallPossibility = (callType) => {
  const state = store.getState().callState;
  if (state == constant.state.CALL_UNAVAILABLE) {
    return false;
  }
  if (
    (callType == constant.callType.VIDEO_PERSONAL_CODE ||
      callType == constant.callType.VIDEO_STRANGER) &&
    state == constant.state.CALL_AVAILABLE_ONLY_CHAT
  ) {
    return false;
  }

  return true;
};

const setCallAvailabitlity = () => {
  const localStream = store.getState().localStream;
  if (localStream) {
    store.setCallState(constant.state.CALL_AVAILABLE);
  } else {
    store.setCallState(constant.state.CALL_AVAILABLE_ONLY_CHAT);
  }
};
