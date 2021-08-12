<?php
//echo "Start";
error_reporting(E_ALL);
$phpFileUploadErrors = array(
  0 => 'There is no error, the file uploaded successfully',
  1 => 'Uploaded file exceeds the upload_max_filesize directive in php.ini',
  2 => 'Uploaded file exceeds the MAX_FILE_SIZE directive specified in the HTML form',
  3 => 'Uploaded file was only partially uploaded',
  4 => 'No file was uploaded',
  6 => 'Missing a temporary folder',
  7 => 'Failed to write file to disk.',
  8 => 'A PHP extension stopped the file upload.',
  // user defined errors below
  101 => 'Photo directory not specified',
  102 => 'Photo directory could not be created',
  103 => 'Unable to open directory',
  105 => 'Unable to move file from tempoary location',
  201 => 'File already exists in folder',
);

$upload_errs = [];
$photos_uploaded_ok = [];
$photos_uploaded_dups = [];
$photos_in_upload = [];
$photos_in_dir = [];

// check directory is specified, create a new directory if necessary
if ("" == trim($_POST['dirname'])) {
  $upload_errs[] = array("dir" => "", "file" => "", "errnum" => 101, "errtxt" => $phpFileUploadErrors[101]);
  return_result($upload_errs, $photos_uploaded_ok, $photos_uploaded_dups);
}
$photosdir = "/volume1/photo/" . $_POST["dirname"];
if (is_dir($photosdir) === false) {
  if (mkdir($photosdir) === false) {
    $upload_errs[] = array("dir" => "", "file" => $photosdir, "errnum" => 102, "errtxt" => $phpFileUploadErrors[102]);
    return_result($upload_errs, $photos_uploaded_ok, $photos_uploaded_dups);
  }
}


// move uploaded files to an existing directory & record results
foreach ($_FILES["jpegs"]["error"] as $key => $error) {
  $tmp_name = $_FILES["jpegs"]["tmp_name"][$key];
  $name = basename($_FILES["jpegs"]["name"][$key]);
  if ($error == UPLOAD_ERR_OK) {
    if (move_uploaded_file($tmp_name, "$photosdir/$name")) {
      $photos_uploaded_ok[] = array("dir" => $photosdir, "file" => $name);
    } else {
      $upload_errs[] = array("dir" => "", "file" => $name, "errnum" => 105, "errtxt" => $phpFileUploadErrors[105]);;
    }
  } else {
    $upload_errs[] = array("dir" => "", "file" => $name, "errnum" => $error, "errtxt" => $phpFileUploadErrors[$error]);
  }
}
//return_result($upload_errs, $photos_uploaded_ok);
return_result($upload_errs, $photos_uploaded_ok, $photos_uploaded_dups);

function return_result($upload_errs, $photos_uploaded_ok, $photos_uploaded_dups)
{
  $result_ok = "";
  foreach ($photos_uploaded_ok as $photo) {
    $result_ok .= "<li>" . $photo['file'] . "&nbsp&nbsp \u{2794} &nbsp&nbsp" . $photo['dir'] . "</li>";
  }
  $result_ok_flag = ($result_ok == "") ? false : true;

  $result_err = "";
  foreach ($upload_errs as $err) {
    $result_err .= "<li class='newjpeg__result__error__detail--name'>" . $err['errtxt'] . ":</li>";
    $result_err .= "<ul>";
    $result_err .= "<li class='newjpeg__result__error__detail--file'>folder: " . $err['dir'] . "</li>";
    $result_err .= "<li class='newjpeg__result__error__detail--file'>file: " . $err['file'] . "</li>";
    $result_err .= "</ul>";
  }
  $result_err_flag = ($result_err == "") ? false : true;

  $result = new stdClass;
  $result->uploadOk = $result_ok_flag;
  $result->uploadOkHTML = $result_ok;

  $result->uploadErr = $result_err_flag;;
  $result->uploadErrHTML = $result_err;

  echo json_encode($result);
  exit;
}
//echo "\nEnd";
