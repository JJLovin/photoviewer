<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="utf-8" />
  <title>Exif</title>
</head>

<body>

  <h2>Test1.jpg</h2>
  <?php
  $jpeg = fopen('Test1.jpg', 'r');
  echo "after fopen<br /> \n";
  if ($jpeg) {
    echo "file opened<br /> \n";
  } else {
    echo "unable to open Test1.jpg";
  }
  $exif = exif_read_data($jpeg);
  echo "after exif_read";
  echo $exif === false ? "No header data found.<br />\n" : "Image contains headers<br />\n";

  foreach ($exif as $key => $section) {

    if (!is_array($section)) {
      echo "$key: $section<br />\n";
    } else {
      foreach ($section as $name => $val) {
        echo "$key.$name: $val<br />\n";
      }
    }
  }
  ?>