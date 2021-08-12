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

  // connect to the database
  $db = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
  if (!$db) {
    echo '<br>Cannot connect to database ' . DB_DATABASE .
      '</br>  Error Num: ' . mysqli_connect_errno() .
      '</br>  Error: ' . mysqli_connect_error();
    exit;
  } else {
    echo '<br>connected to db<br>';
  }

  $qry = "SELECT * FROM Keyword WHERE 1";
  $rslt = mysqli_query($db, $qry);
  if (!$rslt) {
    echo "<p>error num = " . mysqli_errno($db) . "</p>";
    echo "<p>error = " . mysqli_error($db) . "</p>";
  }
  echo "<br><br> SELECT * FROM Keyword:";
  while ($row = mysqli_fetch_assoc($rslt)) {
    $word = $row['keyword'] . " : " . $row['keywordID'];
    echo "<br>keyword: {$word}";
  }

  ?>
</body>

</html>