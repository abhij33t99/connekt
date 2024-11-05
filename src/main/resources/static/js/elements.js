export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Incoming ${callTypeInfo} Call`;

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  const imgPath = "../images/dialogAvatar.png";
  image.src = imgPath;
  imgContainer.appendChild(image);

  const buttonConatiner = document.createElement("div");
  buttonConatiner.classList.add("dialog_button_container");

  const acceptButton = document.createElement("button");
  acceptButton.classList.add("dialog_accept_call_button");
  const acceptCallImg = document.createElement("img");
  acceptCallImg.classList.add("dialog_button_image");
  const acceptCallImgPath = "../images/acceptCall.png";
  acceptCallImg.src = acceptCallImgPath;
  acceptButton.appendChild(acceptCallImg);
  acceptButton.addEventListener("click", () => {
    acceptCallHandler();
  });
  buttonConatiner.appendChild(acceptButton);

  const rejectButton = document.createElement("button");
  rejectButton.classList.add("dialog_reject_call_button");
  const rejectCallImg = document.createElement("img");
  rejectCallImg.classList.add("dialog_button_image");
  const rejectCallImgPath = "../images/rejectCall.png";
  rejectCallImg.src = rejectCallImgPath;
  rejectButton.appendChild(rejectCallImg);
  rejectButton.addEventListener("click", () => {
    rejectCallHandler();
  });
  buttonConatiner.appendChild(rejectButton);

  dialogContent.appendChild(title);
  dialogContent.appendChild(imgContainer);
  dialogContent.appendChild(buttonConatiner);

  return dialog;
};

export const getCallingDialog = (rejectCallHandler) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Calling`;

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  const imgPath = "../images/dialogAvatar.png";
  image.src = imgPath;
  imgContainer.appendChild(image);

  const buttonConatiner = document.createElement("div");
  buttonConatiner.classList.add("dialog_button_container");
  const hangUpButton = document.createElement("button");
  hangUpButton.classList.add("dialog_reject_call_button");
  const hangUpCallImg = document.createElement("img");
  hangUpCallImg.classList.add("dialog_button_image");
  const hangUpCallImgPath = "../images/rejectCall.png";
  hangUpCallImg.src = hangUpCallImgPath;
  hangUpButton.appendChild(hangUpCallImg);
  buttonConatiner.appendChild(hangUpButton);

  dialogContent.appendChild(title);
  dialogContent.appendChild(imgContainer);
  dialogContent.appendChild(buttonConatiner);

  hangUpButton.addEventListener("click", () => {
    rejectCallHandler();
  });

  return dialog;
};

export const getInfoDialog = (titleMsg, message) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = titleMsg;

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  const imgPath = "../images/dialogAvatar.png";
  image.src = imgPath;
  imgContainer.appendChild(image);

  const desc = document.createElement("p");
  desc.classList.add("dialog_description");
  desc.innerHTML = message;

  dialogContent.appendChild(title);
  dialogContent.appendChild(imgContainer);
  dialogContent.appendChild(desc);
  return dialog;
};

export const getLeftMessage = (message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message_left_container");
  const messagePara = document.createElement("p");
  messagePara.classList.add("message_left_paragraph");
  messagePara.innerHTML = message;
  messageContainer.appendChild(messagePara);
  return messageContainer;
};

export const getRightMessage = (message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message_right_container");
  const messagePara = document.createElement("p");
  messagePara.classList.add("message_right_paragraph");
  messagePara.innerHTML = message;
  messageContainer.appendChild(messagePara);
  return messageContainer;
};
