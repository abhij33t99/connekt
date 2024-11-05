import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTC from "./webRTCHandler.js";
import * as constant from "./constant.js";
import * as stranger from "./stranger.js";

let socketIO = null;

export const registerSocketEvent = (socket) => {
  socket.onopen = () => {
    socketIO = socket;
    socket.send(
      JSON.stringify({
        type: "get-socket-id",
      })
    );
  };
};

export const registerSocketMessageEvent = (socket) => {
  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    //handle socket information
    if (data.type === "socket-id") {
      store.setSocketId(data.message);
      ui.updatePersonalCodeInput(data.message);
    }
    //handle pre-offer requet from signaling server
    else if (data.type === "pre-offer") {
      webRTC.handlePreOffer(data.data);
    }
    //handle pre-offer answer from signaling server
    else if (data.type === "pre-offer-answer") {
      webRTC.handlePreOfferAnswer(data.data);
    }
    //handle webRTC signaling
    else if (data.type === "webRTC-signaling") {
      switch (data.data.type) {
        case constant.webRTCSignaling.OFFER:
          webRTC.handleWebRTCOffer(data.data);
          break;
        case constant.webRTCSignaling.ANSWER:
          webRTC.handleWebRTCAnswer(data.data);
          break;
        case constant.webRTCSignaling.ICECANDIDATE:
          webRTC.handleWebRTCCandidate(data.data);
          break;
        default:
          return;
      }
    } else if (data.type === "hang-up") {
      webRTC.handleConnectedUserHangUp();
    } else if (data.type === "get-stranger-socket-id") {
      stranger.connectWithStranger(data.data);
    }
  };
};

export const sendPreOffer = (data) => {
  const preMessage = {
    type: "pre-offer",
    data,
  };

  socketIO.send(JSON.stringify(preMessage));
};

export const sendPreOfferAnswer = (data) => {
  const answerMessage = {
    type: "pre-offer-answer",
    data,
  };

  socketIO.send(JSON.stringify(answerMessage));
};

export const sendDataUsingWebRTC = (data) => {
  const msg = {
    type: "webRTC-signaling",
    data,
  };
  socketIO.send(JSON.stringify(msg));
};

export const sendUserHangUp = (data) => {
  const msg = {
    type: "hang-up",
    data,
  };
  socketIO.send(JSON.stringify(msg));
};

export const changeStrangerConnectionStatus = (status) => {
  const msg = {
    type: "change-stranger-connection-status",
    data: status,
  };
  socketIO.send(JSON.stringify(msg));
};

export const getStrangerSocketId = () => {
  socketIO.send(JSON.stringify({ type: "get-stranger-socket-id" }));
}
