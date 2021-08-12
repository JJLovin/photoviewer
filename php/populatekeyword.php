<!doctype html>
<html lang='en'>

<head>
  <meta charset='utf-8'>
  <title>Table Info</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel='stylesheet' href='../css/utility.css' />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono:400" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sedgwick+Ave&display=swap" />
</head>

<body>

  <?php

  const DB_HOST = 'localhost:3307';  // port 3307 for mysqli
  const DB_USERNAME = 'root';
  const DB_PASSWORD = 'Asdfghjk#1';
  const DB_DATABASE = 'photoViewer';
  const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  // connect to the database
  $db = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
  if (!$db) {
    echo '<p>Cannot connect to database ' . DB_DATABASE .
      '</br>  Error Num: ' . mysqli_connect_errno() .
      '</br>  Error Txt: ' . mysqli_connect_error() . '</p>';
    exit;
  } else {
    echo '<br>connected to db';
  }
  // Remove all rows in Keyword table
  $qry = "DELETE FROM Keyword WHERE 1";
  $rslt = mysqli_query($db, $qry);
  if (!$rslt) {
    sqlError($db, 'DELETE', 'Keyword');
  }
  $qry = "ALTER TABLE Keyword AUTO_INCREMENT = 1";
  $rslt = mysqli_query($db, $qry);

  // Remove all rows in KeyGroup table
  $qry = "DELETE FROM KeyGroup WHERE 1";
  $rslt = mysqli_query($db, $qry);
  if (!$rslt) {
    sqlError($db, 'DELETE', 'KeyGroup');
  }
  $qry = "ALTER TABLE KeyGroup AUTO_INCREMENT = 1";
  $rslt = mysqli_query($db, $qry);

  // Remove all rows in KeySubgroup table
  $qry = "DELETE FROM KeySubgroup WHERE 1";
  $rslt = mysqli_query($db, $qry);
  if (!$rslt) {
    sqlError($db, 'DELETE', 'KeySubgroup');
  }
  $qry = "ALTER TABLE KeySubgroup AUTO_INCREMENT = 1";
  $rslt = mysqli_query($db, $qry);

  //read keywords.txt file
  $keywords = [];
  echo 'opening keywords.txt';
  $keywordsfile = fopen('../keywords/keywords.txt', 'r');
  if (!$keywordsfile) {
    echo "<p>failed to open keywords.txt: $error_get_last()</p>";
  } else {
    echo "<p>keywords.txt opened OK</p>";
  }
  $keywords = [];
  $brackets = array('[', ']');
  while (!feof($keywordsfile)) {
    $keywordsline = fgets($keywordsfile);
    if (!$keywordsline) {
      echo "<p>fgets failed: error_get_last()</p>";
      foreach ($err as $key => $value) {
        echo "<br>{$key} => {$value}";
      }
    }
    $word = str_replace($brackets, '', $keywordsline);
    $tabcount = substr_count($word, "\t", 0, 3);
    $keywords[] = array("word" => trim($word), "tabs" => $tabcount); // remove tabs in LR export
  }
  fclose($keywordsfile);

  //populate tables: Keyword, KeyGroup, KeySubgroup
  $group = '';
  $groupid = NULL;
  $subgroup = '';
  $subgroupid = NULL;
  if (strpos($keywords[0]['word'], '_') === 0) {
  } else {
    echo "Error in Keyword file exported from LR: 1st entry must be a group name staring with '_'";
  }
  for ($i = 0; $i < count($keywords); $i++) {
    // group?
    if (strpos($keywords[$i]['word'], '_') === 0) {
      $group = trim(substr($keywords[$i]['word'], 1));
      $subgroup = '';
      $subgroupid = NULL;
      $qry = "INSERT INTO KeyGroup (name) VALUES ('$group')";
      $rslt = mysqli_query($db, $qry);
      if (!$rslt) {
        sqlError($db, 'INSERT', 'KeyGroup');
        break;
      }
      $groupid = mysqli_insert_id($db);
      echo "<br><p>GROUP: $group / $groupid</p>";

      // not a group, subgroup?
    } else if ((strpos($keywords[$i]['word'], '.') === 0) || (array_search($keywords[$i]['word'], STATES))) {
      $subgroup = trim(str_replace('.', '', $keywords[$i]['word']));
      $qry = "INSERT INTO KeySubgroup (name) VALUES ('$subgroup')";
      $rslt = mysqli_query($db, $qry);
      if (!$rslt) {
        sqlError($db, 'INSERT', 'KeySubgroup');
        break;
      }
      $subgroupid = mysqli_insert_id($db);
      echo "<br><p>SUBGROUP: $subgroup / $subgroupid</p>";

      // not a group, not a subgroup, is keyword
    } else {
      $word = $keywords[$i]['word'];
      $tabs = $keywords[$i]['tabs'];
      if ($tabs == 1) {
        $subgroupid = NULL;
      }
      echo "<p>INSERT=> keyword: $word, tabs: $tabs, groupid: $groupid, subgroupid: $subgroupid</p>";
      if ($subgroupid === NULL) {
        $qry  =  "INSERT INTO Keyword (keyword,tabs,keygroupID,keysubgroupID) VALUES ('$word','$tabs','$groupid', NULL)";
      } else {
        $qry  =  "INSERT INTO Keyword (keyword,tabs,keygroupID,keysubgroupID) VALUES ('$word','$tabs','$groupid','$subgroupid')";
      }
      $rslt = mysqli_query($db, $qry);
      if (!$rslt) {
        sqlError($db, 'INSERT', 'Keyword');
        break;
      }
    }
  }

  function sqlError($db, $action, $table)
  {
    echo "<p>SQL Error - Action: $action, Table: $table " .
      "</br>error num: " . mysqli_errno($db) .
      "</br>error txt: " . mysqli_error($db) . "</p>";
  }
  /*
  // Insert all new keywords from Lightroom
  for ($i = 0; $i < count($keywords); $i++) {
    $word = $keywords[$i];
    $qry = "INSERT INTO Keyword (keyword) VALUES ('$word')";
    $rslt = mysqli_query($db, $qry);
    if (!$rslt) {
      echo "<p>INSERT into Keyword table error num " .
        "</br>error num: " . mysqli_errno($db) .
        "</br>error txt: " . mysqli_error($db) . "</p>";
      //break;
    } else {
      echo "<p>INSERT result for $word: " . $rslt . "</p>";
    }
  }
  echo "<p>INSERTs complete</p>";
  /*
  $qry = "SELECT keywordID, keyword FROM Keyword WHERE 1";
  $rslt = mysqli_query($db, $qry);
  echo "<br><br> SELECT * FROM Keyword:";
  while ($row = mysqli_fetch_assoc($result)) {
    $word = $row['keyword'];
    echo "<br>keyword: {$word}";
  }
*/

  ?>
</body>

</html>