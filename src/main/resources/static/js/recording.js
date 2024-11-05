import * as store from "./store.js";

let mediaRecorder;

const vp9 = "video/webm; codecs=vp9";
const vp9Options = {
  mimeType: vp9,
};
let recordedChunks = [];

export const startRecording = () => {
  const remoteStream = store.getState().remoteStream;
  if (MediaRecorder.isTypeSupported(vp9)) {
    mediaRecorder = new MediaRecorder(remoteStream, vp9Options);
  } else {
    mediaRecorder = new MediaRecorder(remoteStream);
  }
  recordedChunks = [];
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.start(1000);
};

export const pauseRecording = () => {
  mediaRecorder.pause();
};

export const resumeRecording = () => {
  mediaRecorder.resume();
};

export const stopRecording = async () => {
  mediaRecorder.stop();
  await downloadRecordedChunks();
};

const downloadRecordedChunks = async () => {
  const blob = new Blob(recordedChunks, {
    type: "video/webm",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = `recording_${Date.now()}.webm`;
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
};
