import { PROCESS_SERVER_RESULT } from "./constants.js";

export function sendJpegsToServer(fileUploadArray, directoryName) {
  console.log("in function sendJpegsToServer()");
  var formData = new FormData();
  formData.append("dirname", directoryName);
  for (let i = 0; i < fileUploadArray.length; i++) {
    formData.append("jpegs[]", fileUploadArray[i]);
    console.log(`file[${i}].name: ${fileUploadArray[i].name}`);
  }
  var url = encodeURI("php/uploadfiles.php");
  var rqst;
  try {
    rqst = new XMLHttpRequest();
  } catch (err) {
    console.log("rqsterror = " + err);
  }
  rqst.open("POST", url, true);
  rqst.onload = function () {
    var uploadEvent = new CustomEvent("upload", {
      detail: {
        uploadTask: PROCESS_SERVER_RESULT,
        serverResponse: rqst.response,
      },
    });
    window.dispatchEvent(uploadEvent);
  };
  console.log("\nsend rqst");
  rqst.send(formData);
}
