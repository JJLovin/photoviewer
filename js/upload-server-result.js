import { CHOOSE_FILES, CONFIRM_DUPLICATE_FILES } from "./constants.js";

export function processServerResult(serverResponse) {
  console.log("in function processServerResult()");

  let srvrResponse = JSON.parse(serverResponse);

  // check for files already on server
  if (srvrResponse.uploadDup) {
    var uploadEvent = new CustomEvent("upload", {
      detail: {
        uploadTask: CONFIRM_DUPLICATE_FILES,
        dupHTML: srvrResponse.uploadDupHTML,
      },
    });
    window.dispatchEvent(uploadEvent);
    return;
  }

  let okBtn = document.getElementById("newjpeg__result__btns--ok");
  okBtn.removeEventListener("click", callUploadDone);
  var callUploadDone = function () {
    uploadDone();
  };
  okBtn.addEventListener("click", callUploadDone); //named function so we can use removeEventListener

  document.getElementById("newjpeg__result").style.display = "flex";
  if (phpResponse.uploadOk) {
    document.getElementById("newjpeg__result__ok").style.display = "block";
    document.getElementById("newjpeg__result__ok__files").innerHTML = srvrResponse.uploadOkHTML;
  }
  if (phpResponse.uploadErr) {
    document.getElementById("newjpeg__result__error").style.display = "block";
    document.getElementById("newjpeg__result__error__detail").innerHTML = srvrResponse.uploadErrHTML;
  }
}
function uploadDone() {
  var uploadEvent = new CustomEvent("upload", {
    detail: {
      uploadTask: CHOOSE_FILES,
    },
  });
  window.dispatchEvent(uploadEvent);
}

/*
 Result Object format from php

  $result->uploadOk = $result_ok_flag;
  $result->uploadOkHTML = $result_ok;

  $result->uploadErr = $result_err_flag;;
  $result->uploadErrHTML = $result_err;

  $result->uploadDup = $result_dup_flag;;
  $result->uploadDupHTML = $result_dup;
*/
