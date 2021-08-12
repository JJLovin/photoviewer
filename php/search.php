<?php
//echo "Start";
error_reporting(E_ALL);
const DB_HOST = 'localhost:3307';  // port 3307 for mysqli
const DB_USERNAME = 'root';
const DB_PASSWORD = 'Asdfghjk#1';
const DB_DATABASE = 'photoViewer';

  // connect to the database
  $db = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
  if (!$db) {
    echo '<br>Cannot connect to database ' . DB_DATABASE .
      '</br>  Error Num: ' . mysqli_connect_errno() .
      '</br>  Error: ' . mysqli_connect_error();
    exit;
  } else {
    echo '<br>connected to db';
  }

$title = $_POST['title'];
$datestart = $_POST['datestart'];
$dateend = $_POST['dateend'];
$keywords = $_POST['keywords'];

// create db query
// get db results
// format db results into HMTL
// send HTML to requestor
