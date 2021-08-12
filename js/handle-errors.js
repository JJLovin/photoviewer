import { PROGRAM_ERROR } from "./constants.js";

export function displayError(err, data) {
  console.log("in function displayError()");
  const e = new Error();
  const regex = /\/([\w-]+\.js:\d+):\d+$/;
  const match = regex.exec(e.stack.split("\n")[1]); // 2nd line in stack trace is where displayError() was called
  const fileLine = match[1].split(":"); //             2nd element is (capturing group)

  document.getElementById("newjpeg__error__msg--txt").innerHTML = err;
  document.getElementById("newjpeg__error__msg--fileline").innerHTML = "file: " + fileLine[0] + "<br>line: " + fileLine[1];

  if (typeof data !== "undefined") {
    document.getElementById("newjpeg__error__msg--data").innerHTML = data;
  }

  var uploadEvent = new CustomEvent("upload", {
    detail: {
      uploadTask: PROGRAM_ERROR,
    },
  });
  window.dispatchEvent(uploadEvent);
}
