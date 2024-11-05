import * as constant from "./constant.js";
import * as elements from "./elements.js";

export const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById("local_video");
  localVideo.srcObject = stream;

  localVideo.addEventListener("loadedmetadata", () => {
    localVideo.play();
  });
};

export const updateRemoteVideo = (stream) => {
  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = stream;
};

export const updatePersonalCodeInput = (personalCode) => {
  const personalCodeInput = document.getElementById("personal_code_paragraph");
  personalCodeInput.innerHTML = personalCode;
};

export const showIncomingCallDialog = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === constant.callType.CHAT_PERSONAL_CODE ? "Chat" : "Video";
  const incomingCallDialog = elements.getIncomingCallDialog(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );

  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((child) => child.remove());
  dialog.appendChild(incomingCallDialog);
};

export const showCallingDialog = (rejectCallHandler) => {
  const callingDialog = elements.getCallingDialog(rejectCallHandler);
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((child) => child.remove());
  dialog.appendChild(callingDialog);
};

export const removeCallDialogs = () => {
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((child) => child.remove());
};

export const showInfoDialog = (info) => {
  let infoDialog = null;
  if (info === constant.preOfferAnswerType.REJECTED) {
    infoDialog = elements.getInfoDialog(
      "Call rejected",
      "Callee rejected you call"
    );
  } else if (info === constant.preOfferAnswerType.CALLEE_NOT_FOUND) {
    infoDialog = elements.getInfoDialog(
      "Callee not found",
      "Please check personal code and try again"
    );
  } else if (info === constant.preOfferAnswerType.CALL_UNAVAILABLE) {
    infoDialog = elements.getInfoDialog(
      "Call unavailable",
      "Callee on another call, Please try again later"
    );
  }

  if (infoDialog) {
    const dialog = document.getElementById("dialog");
    dialog.appendChild(infoDialog);
    setTimeout(() => {
      removeCallDialogs();
    }, [3000]);
  }
};

export const showCallElements = (callType) => {
  if (
    callType === constant.callType.CHAT_PERSONAL_CODE ||
    callType === constant.callType.CHAT_STRANGER
  ) {
    showChatCallElements();
  } else if (
    callType === constant.callType.VIDEO_PERSONAL_CODE ||
    callType === constant.callType.VIDEO_STRANGER
  ) {
    showVideoCallElements();
  }
};

const showChatCallElements = () => {
  const chatContainer = document.getElementById("finish_chat_button_container");
  showElement(chatContainer);

  const newMessageInput = document.getElementById("new_message_input");
  showElement(newMessageInput);

  const finishChatButton = document.getElementById("finish_chat_call_button");
  showElement(finishChatButton);
  const sendMessage = document.getElementById("send_message_button");
  showElement(sendMessage);
  //block panel
  disableDashboard();
};

const showVideoCallElements = () => {
  const callButtons = document.getElementById("call_buttons");
  showElement(callButtons);

  const placeholder = document.getElementById("video_placeholder");
  hideElement(placeholder);

  const remoteVideo = document.getElementById("remote_video");
  showElement(remoteVideo);

  const newMessageInput = document.getElementById("new_message_input");
  showElement(newMessageInput);
  const sendMessage = document.getElementById("send_message_button");
  showElement(sendMessage);
  //block panel
  disableDashboard();
};

export const showVideoCallButtons = () => {
  const personalCodeVideoButton = document.getElementById(
    "personal_code_video_button"
  );
  const strangerVideoButton = document.getElementById("stranger_video_button");
  showElement(personalCodeVideoButton);
  showElement(strangerVideoButton);
};

//ui call buttons

const micOnImageSrc = "../images/mic.png";
const micOffImageSrc = "../images/micOff.png";
export const updateMicButton = (micEnabled) => {
  const micButtonImage = document.getElementById("mic_button_image");
  micButtonImage.src = micEnabled ? micOffImageSrc : micOnImageSrc;
};

const cameraOnImageSrc = "../images/camera.png";
const cameraOffImageSrc = "../images/cameraOff.png";
export const updateCameraButton = (cameraEnabled) => {
  const cameraButtonImage = document.getElementById("camera_button_image");
  cameraButtonImage.src = cameraEnabled ? cameraOffImageSrc : cameraOnImageSrc;
};

//ui video helper

export const toggleVideoMirror = (id) => {
  const localVideo = document.getElementById(id);
  if (localVideo.classList.contains("video_mirror")) {
    localVideo.classList.remove("video_mirror");
  } else {
    localVideo.classList.add("video_mirror");
  }
};

//ui messages

export const appendMessage = (message, right = false) => {
  const messagesContainer = document.getElementById("messages_container");
  const messageEl = right
    ? elements.getRightMessage(message)
    : elements.getLeftMessage(message);
  messagesContainer.appendChild(messageEl);
};

export const clearMessages = () => {
  const messagesContainer = document.getElementById("messages_container");
  messagesContainer.querySelectorAll("*").forEach((child) => child.remove());
};

//recording
export const showRecordingPanel = () => {
  const recordingButtons = document.getElementById("video_recording_buttons");
  showElement(recordingButtons);

  // hide start recording after it is active
  const startRecordingButton = document.getElementById(
    "start_recording_button"
  );
  hideElement(startRecordingButton);
};

export const resetRecordingPanel = () => {
  const recordingButtons = document.getElementById("video_recording_buttons");
  hideElement(recordingButtons);
  const startRecordingButton = document.getElementById(
    "start_recording_button"
  );
  showElement(startRecordingButton);
};

export const switchRecordingButtons = (switchForResume = false) => {
  const resumeButton = document.getElementById("resume_recording_button");
  const pauseButton = document.getElementById("pause_recording_button");
  const f = switchForResume
    ? () => {
        hideElement(pauseButton);
        showElement(resumeButton);
      }
    : () => {
        hideElement(resumeButton);
        showElement(pauseButton);
      };
  f();
};

//ui helper functions
const enableDashboard = () => {
  const dashboard = document.getElementById("dashboard_blur");
  if (!dashboard.classList.contains("display_none")) {
    dashboard.classList.add("display_none");
  }
};

const disableDashboard = () => {
  const dashboard = document.getElementById("dashboard_blur");
  if (dashboard.classList.contains("display_none")) {
    dashboard.classList.remove("display_none");
  }
};

const hideElement = (element) => {
  if (!element.classList.contains("display_none")) {
    element.classList.add("display_none");
  }
};

const showElement = (element) => {
  if (element.classList.contains("display_none")) {
    element.classList.remove("display_none");
  }
};

export const updateAfterHangUp = (callType) => {
  enableDashboard();
  if (
    callType === constant.callType.VIDEO_PERSONAL_CODE ||
    callType === constant.callType.VIDEO_STRANGER
  ) {
    const callButtons = document.getElementById("call_buttons");
    hideElement(callButtons);
  } else {
    const chatCallButtons = document.getElementById(
      "finish_chat_button_container"
    );
    hideElement(chatCallButtons);
  }

  const newMessageInput = document.getElementById("new_message_input");
  hideElement(newMessageInput);
  const sendMessage = document.getElementById("send_message_button");
  hideElement(sendMessage);
  clearMessages();

  updateMicButton(false);
  updateCameraButton(false);

  //hide remote video
  const placeholder = document.getElementById("video_placeholder");
  showElement(placeholder);
  const remote_video = document.getElementById("remote_video");
  hideElement(remote_video);

  removeCallDialogs();
};

//strangers
export const updateStrangerCheckbox = (allowStrangers) => {
  const checkboxCheckImage = document.getElementById(
    "allow_strangers_checkbox_image"
  );

  allowStrangers
    ? showElement(checkboxCheckImage)
    : hideElement(checkboxCheckImage);
};

export const showNoStrangerAvailable = () => {
  const infoDialog = elements.getInfoDialog(
    "No strangers available",
    "Please try again later"
  );
  if (infoDialog) {
    const dialog = document.getElementById("dialog");
    dialog.appendChild(infoDialog);
    setTimeout(() => {
      removeCallDialogs();
    }, [3000]);
  }
};
