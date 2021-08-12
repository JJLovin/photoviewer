import { VERIFY_FILES, GET_FOLDER_LIST } from "./constants.js";
import { ERR_TOO_MANY_FOLDERS, ERR_NOT_FILE_NOT_FOLDER, ERR_FILE_AND_FOLDER } from "./constants.js";
import { displayError } from "./handle-errors.js";

var fileUploadArray = [];
var directoryName = "";

export function getSelectedFiles() {
  console.log("in function getSelectedFiles()");
  fileUploadArray.length = 0;
  const dataTransfer = new DataTransfer();
  var photos = document.getElementById("newjpeg__upload__form__input");
  for (let i = 0; i < photos.files.length; i++) {
    // console.log(`photo: ${photos.files[i].name},  size: ${photos.files[i].size},  type: ${photos.files[i].type}`);
    dataTransfer.items.add(photos.files[i]);
    fileUploadArray.push(photos.files[i]);
  }
  var uploadEvent = new CustomEvent("upload", {
    detail: {
      uploadTask: GET_FOLDER_LIST,
      filesToUpload: fileUploadArray,
    },
  });
  window.dispatchEvent(uploadEvent);
}

export async function getDroppedFiles(dropEvent) {
  console.log("in getDroppedFiles()");
  console.log(`dropEvent: ${dropEvent}`);

  fileUploadArray.length = 0;
  directoryName = "";

  var dataTransferItems = dropEvent.dataTransfer.items;
  if (!validateDropItems(dataTransferItems)) return; // ensure only files or only one directory

  for (let i = 0; i < dataTransferItems.length; i++) {
    var fileSysEntry = dataTransferItems[i].webkitGetAsEntry();
    //File
    if (fileSysEntry.isFile) {
      let fileObj = dataTransferItems[i].getAsFile(); // entry is a file. create file object & push onto array
      // console.log(`push getAsFile(): ${fileObj}`);
      fileUploadArray.push(fileObj);

      //Directory
    } else if (fileSysEntry.isDirectory) {
      directoryName = fileSysEntry.name;
      // console.log(`directoryName: ${fileSysEntry.name}`);
      let directoryReader = fileSysEntry.createReader();
      await readDirEntries(directoryReader);
    } else {
      displayError(ERR_NOT_FILE_NOT_FOLDER, fileSysEntry.name);
      return;
    }
  }
  if (directoryName) {
    var uploadEvent = new CustomEvent("upload", {
      detail: {
        uploadTask: VERIFY_FILES,
        filesToUpload: fileUploadArray,
        directory: directoryName,
      },
    });
  } else {
    var uploadEvent = new CustomEvent("upload", {
      detail: {
        uploadTask: GET_FOLDER_LIST,
        filesToUpload: fileUploadArray,
      },
    });
  }
  window.dispatchEvent(uploadEvent);
}

function validateDropItems(dataTransferItems) {
  for (let i = 0; i < dataTransferItems.length; i++) {
    if (dataTransferItems[i].kind != "file") {
      displayError(ERR_NOT_FILE_NOT_FOLDER, dataTransferItems[i].kind);
      return false;
    }
  }
  // only one directory at a time for upload; check for multiple directories
  let uploadDirectory = false;
  for (let i = 0; i < dataTransferItems.length; i++) {
    var fileSysEntry = dataTransferItems[i].webkitGetAsEntry();
    if (fileSysEntry.isDirectory) {
      if (uploadDirectory) {
        displayError(ERR_TOO_MANY_FOLDERS);
        return false;
      } else {
        uploadDirectory = true;
      }
    }
  }
  // one directory or file/s may be uploaded, not a combination of files/directory
  for (let i = 0; i < dataTransferItems.length; i++) {
    var fileSysEntry = dataTransferItems[i].webkitGetAsEntry();
    if (fileSysEntry.isFile && uploadDirectory == true) {
      displayError(ERR_FILE_AND_FOLDER);
      return false;
    }
  }
  return true;
}

async function readDirEntries(directoryReader) {
  return new Promise((resolve) => {
    directoryReader.readEntries(async function (fileSysEntries) {
      await createFileObjs(fileSysEntries);
      resolve();
    });
  });
}

async function createFileObjs(fileSysEntries) {
  for (let i = 0; i < fileSysEntries.length; i++) {
    // console.log(`start: getfileObj: ${fileSysEntries[i].fullPath}`);
    if (fileSysEntries[i].isDirectory) {
      console.log(`subdirectories not allowed: ${fileSysEntries[i].name}`);
      continue;
    }
    let fileName = await getFileObj(fileSysEntries[i]);
    // console.log(`end: getfileObj: ${fileName},  fileUploadArray.length = ${fileUploadArray.length}`);
  }
}

function getFileObj(fileSysEntry) {
  return new Promise((resolve) => {
    fileSysEntry.file((fileObj) => {
      fileUploadArray.push(fileObj);
      // console.log(`completed ${fileObj.name}`);
      resolve(fileObj.name);
    });
  });
}
