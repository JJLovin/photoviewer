import { CHOOSE_FILES, SEND_TO_SERVER } from "./constants.js";
import { ERR_NO_FOLDER_NAME } from "./constants.js";
import { displayError } from "./handle-errors.js";
import { hideAllScreens } from "./upload-event-handler";

export function verifyUploadFileList(fileUploadArray, directoryName) {
  console.log("in function verifyUploadFileList()");
  //console.log(`fileUploadArray.length = ${fileUploadArray.length}`);
  //for (let i = 0; i < fileUploadArray.length; i++) {
  //  console.log(`fileUploadArray[${i}].name = ${fileUploadArray[i].name}`);
  //}
  console.log(`directoryName: ${directoryName}`);
  if (directoryName) {
    let dir = document.getElementById("newjpeg__files__foldername");
    dir.innerHTML = directoryName;
  } else {
    displayError(ERR_NO_FOLDER_NAME);
    return;
  }

  // create ul of files/folders selected for upload
  var ul = document.getElementById("newjpeg__files__ul");
  ul.innerHTML = "";
  for (let i = 0; i < fileUploadArray.length; i++) {
    let li = document.createElement("li");
    li.setAttribute("class", "newjpeg__files__ul__li");
    let name = document.createTextNode(fileUploadArray[i].name);
    li.appendChild(name);
    ul.appendChild(li);
  }

  hideAllScreens();
  document.getElementById("newjpeg__files").style.display = "grid";

  // add button listeners
  let cancelBtn = document.getElementById("newjpeg__files__btns--cancel");
  cancelBtn.removeEventListener("click", callCancelUpload);
  var callCancelUpload = function () {
    cancelUpload(fileUploadArray);
  };
  cancelBtn.addEventListener("click", callCancelUpload);

  let uploadBtn = document.getElementById("newjpeg__files__btns--upload");
  uploadBtn.removeEventListener("click", callUploadFiles);
  var callUploadFiles = function () {
    uploadFiles(fileUploadArray, directoryName);
  };
  uploadBtn.addEventListener("click", callUploadFiles);
}

function uploadFiles(fileUploadArray, directoryName) {
  var uploadEvent = new CustomEvent("upload", {
    detail: {
      uploadTask: SEND_TO_SERVER,
      filesToUpload: fileUploadArray,
      directory: directoryName,
    },
  });
  window.dispatchEvent(uploadEvent);
  return;
}

function cancelUpload(fileUploadArray) {
  var uploadEvent = new CustomEvent("upload", {
    detail: {
      uploadTask: CHOOSE_FILES,
      filesToUpload: fileUploadArray,
    },
  });
  window.dispatchEvent(uploadEvent);
  return;
}
