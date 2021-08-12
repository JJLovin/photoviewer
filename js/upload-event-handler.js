import {
  CHOOSE_FILES,
  GET_SELECTED_FILES,
  GET_DROPPED_FILES,
  VERIFY_FILES,
  GET_FOLDER_LIST,
  PROCESS_SERVER_RESULT,
  SEND_TO_SERVER,
  CONFIRM_DUPLICATE_FILES,
  CANCEL_UPLOAD,
  AJAX_ERROR,
  PROGRAM_ERROR,
} from "./constants.js";
import { getSelectedFiles, getDroppedFiles } from "./upload-get-files.js";
import { verifyUploadFileList } from "./upload-verify-files";
import { sendJpegsToServer } from "./upload-send-to-server";
import { getFolderList } from "./upload-get-folder.js";
import { processServerResult } from "./upload-server-result";

window.onload = initUploadPage;

function uploadEventHandler(event) {
  console.log("in function uploadEventHandler()");
  let uploadTask = event.detail.uploadTask;
  console.log(`event is ${uploadTask}`);

  switch (uploadTask) {
    case CHOOSE_FILES:
      hideAllScreens();
      document.getElementById("newjpeg__upload").style.display = "flex";
      break;
    case GET_SELECTED_FILES:
      hideAllScreens();
      document.getElementById("newjpeg__files").style.display = "grid";
      getSelectedFiles();
      break;

    case GET_DROPPED_FILES:
      hideAllScreens();
      document.getElementById("newjpeg__files").style.display = "grid";
      getDroppedFiles(event.detail.dropEvent);
      break;

    case VERIFY_FILES:
      verifyUploadFileList(event.detail.filesToUpload, event.detail.directory);
      break;

    case GET_FOLDER_LIST:
      hideAllScreens();
      document.getElementById("newjpeg__folder").style.display = "grid";
      getFolderList(event.detail.filesToUpload);
      break;

    case SEND_TO_SERVER:
      sendJpegsToServer(event.detail.filesToUpload, event.detail.directory);
      break;

    case PROCESS_SERVER_RESULT:
      hideAllScreens();
      processServerResult(event.detail.serverResponse);
      break;

    case CONFIRM_DUPLICATE_FILES:
      hideAllScreens();
      confirmDuplicateFiles(event.detail.dupHTML);
      break;

    case CANCEL_UPLOAD:
      break;

    case AJAX_ERROR:
      break;

    case PROGRAM_ERROR:
      hideAllScreens();
      document.getElementById("newjpeg__error").style.display = "grid";
      break;

    default:
      break;
  }
}

export function hideAllScreens() {
  document.getElementById("newjpeg__files").style.display = "none";
  document.getElementById("newjpeg__folder").style.display = "none";
  document.getElementById("newjpeg__upload").style.display = "none";
  document.getElementById("newjpeg__result").style.display = "none";
  document.getElementById("newjpeg__error").style.display = "none";
  document.getElementById("newjpeg__newfolder").style.display = "none";
}

function initUploadPage() {
  // all events handled by uploadEventHandler()
  window.addEventListener("upload", (event) => {
    uploadEventHandler(event);
  });

  // change event fires on <input> when file(s) selected
  let inputForm = document.getElementById("newjpeg__upload__form__input");
  inputForm.addEventListener("change", () => {
    var uploadEvent = new CustomEvent("upload", {
      detail: {
        uploadTask: GET_SELECTED_FILES,
      },
    });
    window.dispatchEvent(uploadEvent);
  });

  // setup drop zone
  let dropzone = document.getElementById("newjpeg__upload__form");
  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.style.borderColor = "#d8dcf1";
  });
  dropzone.addEventListener("dragenter", () => {
    dropzone.style.borderColor = "#d8dcf1";
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "#6271c8";
  });
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    var uploadEvent = new CustomEvent("upload", {
      detail: {
        uploadTask: GET_DROPPED_FILES,
        dropEvent: event,
      },
    });
    window.dispatchEvent(uploadEvent);
  });
}
