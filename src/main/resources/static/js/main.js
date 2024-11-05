import * as store from "./store.js";
import * as wss from "./wss.js";
import * as webRTC from "./webRTCHandler.js";
import * as constant from "./constant.js";
import * as ui from "./ui.js";
import * as recorder from "./recording.js";
import * as stranger from "./stranger.js";

//initializing and getting the socket id
const socket = new WebSocket("ws://localhost:8080/socket");
wss.registerSocketEvent(socket);
wss.registerSocketMessageEvent(socket);

webRTC.getLocalPreview();

//personal code copy button event listener
const personalCodeCopyButton = document.getElementById(
  "personal_code_copy_button"
);
personalCodeCopyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(store.getState().socketId);
});

//register event listeners for connection buttons and send pre offer
const personalCodeChatButton = document.getElementById(
  "personal_code_chat_button"
);
const personal_code_video_button = document.getElementById(
  "personal_code_video_button"
);

personalCodeChatButton.addEventListener("click", () => {
  const calleeId = document.getElementById("personal_code_input");
  webRTC.sendPreOffer(calleeId.value, constant.callType.CHAT_PERSONAL_CODE);
});

personal_code_video_button.addEventListener("click", () => {
  const callerId = document.getElementById("personal_code_input");
  webRTC.sendPreOffer(callerId.value, constant.callType.VIDEO_PERSONAL_CODE);
});

//event listeners for strangers buttons
const strangerChatButton = document.getElementById("stranger_chat_button");
const strangerVideoButton = document.getElementById("stranger_video_button");

strangerChatButton.addEventListener("click", () => {
  stranger.getStrangerSocketIdAndConnect(constant.callType.CHAT_STRANGER);
});

strangerVideoButton.addEventListener("click", () => {
  stranger.getStrangerSocketIdAndConnect(constant.callType.VIDEO_STRANGER);
});

//event listeners for allow strangers
const checkbox = document.getElementById("allow_strangers_checkbox");
checkbox.addEventListener("click", () => {
  const checkBoxState = store.getState().allowConnectionsFromStrangers;
  ui.updateStrangerCheckbox(!checkBoxState);
  store.setAllowConnectionsFromStrangers(!checkBoxState);
  stranger.changeStrangerConnectionStatus(!checkBoxState);
});

//event listeners for video call buttons
const mic_button = document.getElementById("mic_button");
mic_button.addEventListener("click", () => {
  const localStream = store.getState().localStream;
  const micEnabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micEnabled;
  ui.updateMicButton(micEnabled);
});

const camera_button = document.getElementById("camera_button");
camera_button.addEventListener("click", () => {
  const localStream = store.getState().localStream;
  const cameraEnabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !cameraEnabled;
  ui.updateCameraButton(cameraEnabled);
});

const switchScreenShare = document.getElementById("screen_sharing_button");
switchScreenShare.addEventListener("click", () => {
  const screenSharingActive = store.getState().screenSharingActive;
  webRTC.switchBetweenCameraAndScreenSharing(screenSharingActive);
});

const flip_image_button = document.getElementById("flip_image_button");
flip_image_button.addEventListener("click", () => {
  ui.toggleVideoMirror("remote_video");
});

//event listener for new message
const newMessageInput = document.getElementById("new_message_input");
newMessageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    webRTC.sendMessageUsingDataChannel(e.target.value);
    ui.appendMessage(e.target.value, true);
    newMessageInput.value = "";
  }
});

const sendMessageButton = document.getElementById("send_message_button");
sendMessageButton.addEventListener("click", () => {
  webRTC.sendMessageUsingDataChannel(newMessageInput.value);
  ui.appendMessage(newMessageInput.value, true);
  newMessageInput.value = "";
});

//recording event listeners
const startRecordingButton = document.getElementById("start_recording_button");
startRecordingButton.addEventListener("click", () => {
  recorder.startRecording();
  ui.showRecordingPanel();
});

const stopRecordingButton = document.getElementById("stop_recording_button");
stopRecordingButton.addEventListener("click", async () => {
  await recorder.stopRecording();
  ui.resetRecordingPanel();
});

const pauseRecordingButton = document.getElementById("pause_recording_button");
pauseRecordingButton.addEventListener("click", () => {
  recorder.pauseRecording();
  ui.switchRecordingButtons(true);
});

const resumeRecordingButton = document.getElementById(
  "resume_recording_button"
);
resumeRecordingButton.addEventListener("click", () => {
  recorder.resumeRecording();
  ui.switchRecordingButtons(false);
});

//hang up
const hangUpButton = document.getElementById("hang_up_button");
hangUpButton.addEventListener("click", () => {
  webRTC.handleHangUp();
});

const hangUpChatButton = document.getElementById("finish_chat_call_button");
hangUpChatButton.addEventListener("click", () => {
  webRTC.handleHangUp();
});
