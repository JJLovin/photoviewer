<!doctype html>
<html lang='en'>

<head>
  <meta charset='utf-8'>
  <title>Table Info</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel='stylesheet' href='../css/createtables.css' />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono:400" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sedgwick+Ave&display=swap" />
</head>

<body>

  <?php

  const DB_HOST = 'localhost:3307';  // port 3307 for mysqli
  const DB_USERNAME = 'root';
  const DB_PASSWORD = 'Asdfghjk#1';
  const DB_DATABASE = 'photoViewer';

  $folder = (isset($_POST['folder'])) ? TRUE : FALSE;
  $photo = (isset($_POST['photo'])) ? TRUE : FALSE;
  $keyword = (isset($_POST['keyword'])) ? TRUE : FALSE;
  $photokeyword = (isset($_POST['photokeyword'])) ? TRUE : FALSE;
  $keygroup = (isset($_POST['keygroup'])) ? TRUE : FALSE;
  $keysubgroup = (isset($_POST['keysubgroup'])) ? TRUE : FALSE;

  // connect to the database
  $db = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
  if (!$db) {
    echo 'Cannot connect to database ' . DB_DATABASE .
      '</br>  Error Num: ' . mysqli_connect_errno() .
      '</br>  Error: ' . mysqli_connect_error();
    exit;
  } else {
    echo 'connected to db';
  }

  // define tables
  $queries = [];
  if ($folder) {
    $qry  = "CREATE TABLE Folder (";
    $qry .= "id           SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,";
    $qry .= "name         TINYTEXT NOT NULL,";
    $qry .= "path         TINYTEXT NOT NULL,";
    $qry .= "startDate    DATE,";
    $qry .= "firstPhotoDate   DATE,";
    $qry .= "lastPhotoDate    DATE,";
    $qry .= "countries    TINYTEXT,";
    $qry .= "states       TINYTEXT,";
    $qry .= "locations    TINYTEXT,";
    $qry .= "description  TINYTEXT";
    $qry .= ") ENGINE = InnoDB;";
    array_push($queries, $qry);
  }
  if ($keyword) {
    $qry  = "CREATE TABLE Keyword (";
    $qry .= "id             SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,";
    $qry .= "keyword        TINYTEXT NOT NULL";
    $qry .= "tabs           TINYINT UNSIGNED,";
    $qry .= "keygroupID     TINYINT UNSIGNED,";
    $qry .= "keysubgroupID  TINYINT UNSIGNED,";
    $qry .= ") ENGINE = INNODB";
    array_push($queries, $qry);
  }
  if ($photo) {
    $qry  = "CREATE TABLE Photo (";
    $qry .= "id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,";
    $qry .= "name          TINYTEXT NOT NULL,";
    $qry .= "photoPath     TINYTEXT NOT NULL,";
    $qry .= "thumbPath     TINYTEXT,";
    $qry .= "title         TINYTEXT,";
    $qry .= "caption       TINYTEXT,";
    $qry .= "dateTime      DATETIME,";
    $qry .= "exposure      TINYTEXT,";
    $qry .= "fStop         TINYTEXT,";
    $qry .= "focalLen      TINYTEXT,";
    $qry .= "focalLen35mm  TINYTEXT,";
    $qry .= "ISO           TINYTEXT,";
    $qry .= "height        SMALLINT UNSIGNED,";
    $qry .= "width         SMALLINT UNSIGNED,";
    $qry .= "cameraMake    TINYTEXT,";
    $qry .= "cameraModel   TINYTEXT,";
    $qry .= "cameraLens    TINYTEXT,";
    $qry .= "flash         BOOLEAN,";
    $qry .= "latitude      FLOAT,";
    $qry .= "latitudeRef   TINYTEXT,";
    $qry .= "longitude     FLOAT,";
    $qry .= "longitudeRef  TINYTEXT,";
    $qry .= "folderID      SMALLINT UNSIGNED NOT NULL,";
    $qry .= "CONSTRAINT `foreignkey_folder`";
    $qry .= "  FOREIGN KEY (folderID) REFERENCES Folder(id)";  // can't add a photo  without a folder
    $qry .= "  ON DELETE CASCADE";   // deleting folder deletes all photos in it
    $qry .= "  ON UPDATE RESTRICT";  // can't update folderID if it's used in photos table
    $qry .= ") ENGINE = INNODB";
    array_push($queries, $qry);
  }
  if ($photokeyword) {
    $qry  = "CREATE TABLE PhotoKeyword (";
    $qry .= "photoID       INT UNSIGNED NOT NULL,";
    $qry .= "keywordID     SMALLINT UNSIGNED NOT NULL,";
    $qry .= "FOREIGN KEY  (photoID) REFERENCES Photo(id),";
    $qry .= "FOREIGN KEY  (keywordID) REFERENCES Keyword(id),";
    $qry .= "UNIQUE (photoID, keywordID)";
    $qry .= ") ENGINE = INNODB";
    array_push($queries, $qry);
  }
  if ($keygroup) {
    $qry  = "CREATE TABLE KeyGroup (";
    $qry .= "id     INT UNSIGNED NOT NULL,";
    $qry .= "name   TINYTEXT NOT NULL,";
    $qry .= ") ENGINE = INNODB";
    array_push($queries, $qry);
  }
  if ($keysubgroup) {
    $qry  = "CREATE TABLE KeySubgroup (";
    $qry .= "id     INT UNSIGNED NOT NULL,";
    $qry .= "name   TINYTEXT NOT NULL,";
    $qry .= ") ENGINE = INNODB";
    array_push($queries, $qry);
  }

  //create tables & display results
  for ($i = 0; $i < count($queries); $i++) {
    $tableName = substr($queries[$i], 13, strpos($queries[$i], "(") - 14);
    $rslt = mysqli_query($db, $queries[$i]);
    if (!$rslt) {
      if (mysqli_errno($db) == 1050) {
        //echo "<p>table $tableName already exists.</p>";
      } else {
        echo "<p>$tableName: create table error num = " . mysqli_errno($db) . "</p>";
        echo "<p>$tableName: create table error = " . mysqli_error($db) . "</p>";
        break;
      }
    }
    $qry = "DESCRIBE $tableName";
    $rslt = mysqli_query($db, $qry);

    $table = "<table> <tr> <th>Field</th> <th>Type</th> <th>Null</th> <th>Key</th> </tr>";
    while ($row = mysqli_fetch_assoc($rslt)) {
      $table .= "<tr>";
      $table .= "<td>" . $row['Field'] . "</td>";
      $table .= "<td>" . $row['Type'] . "</td>";
      $table .= "<td>" . $row['Null'] . "</td>";
      $table .= "<td>" . $row['Key'] . "</td>";
      $table .= "</tr>";
    }
    $table .= "</table>";
    echo "<h2>table: " . $tableName . " </h2>";
    echo $table;
  }
  ?>
</body>

</html>