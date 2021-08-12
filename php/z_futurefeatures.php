<?php

// --- check for photos being uploaded already in directory ---
// add to file uploadfiles.php before moving uploaded files
foreach ($_FILES['jpegs']['name'] as $key => $name) {
  $photos_in_upload[] = $name;
}
if ($photosdir_handle = opendir($photosdir)) {
  while (($file = readdir($photosdir_handle)) !== false) {
    $photos_in_dir[] = $file;
  }
  closedir($photosdir_handle);
} else {
  $upload_errs[] = array("dir" => "photosdir", "file" => "", "errnum" => 103, "errtxt" => $phpFileUploadErrors[103]);
  return_result($upload_errs, $photos_uploaded_ok, $photos_uploaded_dups);
}
foreach ($photos_in_upload as $up) {
  foreach ($photos_in_dir as $dir) {
    if (trim($up) == trim($dir)) {
      $upPath = $photosdir . "/" . $up;
      $fs = number_format(filesize($upPath));
      $fd = date('d-M-Y G:i:s', filemtime($upPath));
      $photos_uploaded_dups[] = array("dir" => $photosdir, "file" => $up, "size" => $fs, "date" => $fd);
    }
  }
}
if (sizeof($photos_uploaded_dups) > 0) {
  return_result($upload_errs, $photos_uploaded_ok, $photos_uploaded_dups);
  exit;
}
// add these lines to function return_result
function return_result($upload_errs, $photos_uploaded_ok, $photos_uploaded_dups)
{
  $result_dup = "";
  foreach ($photos_uploaded_dups as $dup) {
    $fullpath = $dup['dir'] . "/" . $dup['file'];
    $result_dup .= "<li class='newjpeg_duplicate_list--item'>" . $fullpath . " \u{2794} size: " . $dup['size'] . " ; date: " . $dup['date'];
  }
  $result_dup_flag = ($result_dup == "") ? false : true;
  $result = new stdClass;
  $result->uploadDup = $result_dup_flag;;
  $result->uploadDupHTML = $result_dup;
}
// --- end check for duplicate files ---

// --- list files in the root directory ---
$path = $_SERVER['DOCUMENT_ROOT'];
echo "\nDOCUMENT_ROOT: " . $path;
$dir_handle = opendir($path);
while (false !== ($entry = readdir($dir_handle))) {
  echo "\nentry: " . $entry;
}
closedir($dir_handle);
// --- end list files in root ---
