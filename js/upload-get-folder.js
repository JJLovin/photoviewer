import { CHOOSE_FILES, VERIFY_FILES } from "./constants.js";
var callSetFolderName, callCancelUpload;

export function getFolderList(fileUploadArray) {
  console.log("in function getFolderList()");
  var url = encodeURI("php/getdirlist.php");
  var rqst;
  try {
    rqst = new XMLHttpRequest();
  } catch (err) {
    console.log("rqsterror = " + err);
  }
  rqst.open("POST", url, true);
  rqst.send();
  rqst.onload = function () {
    // console.log(rqst.response);
    document.getElementById("newjpeg__folder__form").innerHTML = rqst.response;
  };

  // add button listeners
  let okBtn = document.getElementById("newjpeg__folder__btns--ok");
  okBtn.removeEventListener("click", callSetFolderName);
  callSetFolderName = function () {
    setFolderName(fileUploadArray);
  };
  okBtn.addEventListener("click", callSetFolderName); //named function so we can use removeEventListener

  let cancelBtn = document.getElementById("newjpeg__folder__btns--cancel");
  cancelBtn.removeEventListener("click", callCancelUpload);
  callCancelUpload = function () {
    console.log("in function callCancelUpload");
    cancelUpload(fileUploadArray);
  };
  cancelBtn.addEventListener("click", callCancelUpload); //named function so we can use removeEventListener
}

function cancelUpload(fileUploadArray) {
  document.getElementById("newjpeg__folder__btns--cancel").removeEventListener("click", cancelUpload);
  var uploadEvent = new CustomEvent("upload", {
    detail: {
      uploadTask: CHOOSE_FILES,
      filesToUpload: fileUploadArray,
    },
  });
  window.dispatchEvent(uploadEvent);
  return;
}

function setFolderName(fileUploadArray) {
  let folderSelected = false;
  let folderList = document.getElementById("newjpeg__folder__form");
  let radioBtns = folderList.getElementsByTagName("input");
  for (let i = 0; i < radioBtns.length; i++) {
    if (radioBtns[i].checked) {
      console.log(`radioBtn checked: ${radioBtns[i].value}`);
      var uploadEvent = new CustomEvent("upload", {
        detail: {
          uploadTask: VERIFY_FILES,
          filesToUpload: fileUploadArray,
          directory: radioBtns[i].value,
        },
      });
      folderSelected = true;
      window.dispatchEvent(uploadEvent);
      break;
    }
  }
  if (!folderSelected) alert("Please select a folder");
}
