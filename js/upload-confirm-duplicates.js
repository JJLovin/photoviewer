import { CHOOSE_FILES, CONFIRM_DUPLICATE_FILES } from "./constants.js";

export function confirmDuplicateFiles(dupFilesHTML) {
  console.log("in function processServerResult()");
  
  document.getElementById("newjpeg__duplicate__list").innerHTML = dupFilesHTML;
  document.getElementById("newjpeg_duplicate__list").style.display = "flex";

  let skipBtn = document.getElementById("newjpeg__duplicate__btns--skip");
  skipBtn.removeEventListener("click", callSkipDuplicates);
  var callSkipDuplicates = function () {
    skipDuplicates();
  };
  skipBtn.addEventListener("click", callSkipDuplicates); //named function so we can use removeEventListener

  let replaceBtn = document.getElementById("newjpeg__duplicate__btns--replace");
  replaceBtn.removeEventListener("click", callReplaceDuplicates);
  var callReplaceDuplicates = function () {
    replaceDuplicates();
  };
  replaceBtn.addEventListener("click", callReplaceDuplicates); //named function so we can use removeEventListener

  let cancelBtn = document.getElementById("newjpeg__duplicate__btns--cancel");
  cancelBtn.removeEventListener("click", callCancelDuplicates);
  var callCancelDuplicates = function () {
    cancelDuplicates();
  };
  cancelBtn.addEventListener("click", callCancelDuplicates); //named function so we can use removeEventListener

}

function skipDuplicates() {}

function replaceDuplicates() {}

function cancelDuplicates() {
  var uploadEvent = new CustomEvent("upload", {
    detail: {
      uploadTask: CHOOSE_FILES,
    },
  });
  window.dispatchEvent(uploadEvent);
}

