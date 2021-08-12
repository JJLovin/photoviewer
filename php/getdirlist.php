<?php
error_reporting(E_ALL);

$dirlist = array();
$photodir = "/volume1/photo/";

if ($handle = opendir($photodir)) {
  while ($entry = readdir($handle)) {
    if (is_dir($photodir . $entry)) {
      if (!(strpos($entry, '.') === 0) && !(strpos($entry, '@') === 0)) {
        $dirlist[] = $entry;
      }
    }
  }
} else {
  echo "error opening " .  $photodir;
  return;
}
rsort($dirlist);  // show newest folders first

$folderform = '';
$n = 1;
foreach ($dirlist as $dirname) {
  $dirnum = "f" . $n++;
  $folderform .= '<div class="newjpeg__folder__item">';
  $folderform .= '<input id="' . $dirnum . '" value="' . $dirname . '" name="folders" type="radio">';
  $folderform .= '<label for="' . $dirnum . '">' . $dirname . '</label>';
  $folderform .= '</div>';
}
echo $folderform;
