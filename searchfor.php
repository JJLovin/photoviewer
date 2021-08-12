<!doctype html>
<html lang='en'>

<head>
  <meta charset="utf-8" />
  <title>Search</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="css/search.css" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono:400" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono:200" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sedgwick+Ave&display=swap" />
  <script type="text/javascript" src="js/search.js"></script>
</head>

<body>
  <div class="menu">
    <div>
      <a href="#" class="menu__item">Home</a>
    </div>
    <div>
      <a href="#" class="menu__item">Folder</a>
      <a href="#" class="menu__item">Search</a>
    </div>
  </div>

  <div class="datestitle">
    <div class="dates">
      <div class="dates__start">
        <label for="date-start">
          <h2>Start Date</h2>
        </label>
        <input id="date-start" type="date" name="date-start" size="15" />
      </div>
      <div>
        <label for="date-end">
          <h2>End Date</h2>
        </label>
        <input id="date-end" type="date" name="date-end" size="15" />
      </div>
    </div>
    <div class="title">
      <label for="title">
        <h2>Title/Caption Words</h2>
      </label>
      <input id="title" type="text" name="title" size="40" />
    </div>
  </div>

  <?php
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
  }

  $qry =  "SELECT kw.keyword AS keyword, kw.tabs, grp.name AS grp_name, sub.name AS sub_name ";
  $qry .= "FROM Keyword AS kw ";
  $qry .= "LEFT JOIN KeyGroup AS grp ON kw.keygroupID = grp.id ";
  $qry .= "LEFT JOIN KeySubgroup AS sub ON kw.keysubgroupID = sub.id;";

  $rslt = mysqli_query($db, $qry);
  if (!$rslt) {
    sqlError($db, 'SELECT', 'Keyword, KeyGroup, KeySubgroup');
  }

  $result = '';
  $currentGroup = NULL;
  $firstGroup = TRUE;
  $currentSubgroup = NULL;
  $activeSubgroup = FALSE;

  while ($keyword_row = mysqli_fetch_assoc($rslt)) {
    $keyword = $keyword_row['keyword'];
    $tabLevel = $keyword_row['tabs'];
    $nextGroup = $keyword_row['grp_name'];
    $nextSubgroup = $keyword_row['sub_name'];

    // newgroup?
    if ($nextGroup != $currentGroup) {
      $currentGroup = $nextGroup;
      if ($firstgroup) {
        $firstGroup = FALSE;
      } else {
        $result .= "</ul></div>";
      }
      $result .= "<div class='key__group'>";
      $result .= '<h2 class="key__group__name">' . $nextGroup . '</h2>';
      $result .= '<ul class="key__group__list">';
      $activeSubgroup = FALSE;
    }
    // new subgroup?
    if ($nextSubgroup != $currentSubgroup && $tabLevel >= 1 && $nextSubgroup != NULL) {
      if ($activeSubgroup) {
        $result .= "</ul></li>";
      }
      $result .= "<li class='key__group__subgroup'>";
      $result .= "<span class='key__group__list--item'>$nextSubgroup</span>";
      $result .= "<ul class='key__group__list'>";
      $activeSubgroup = TRUE;
      $currentSubgroup = $nextSubgroup;
    }
    // end of subgroup?
    if ($nextSubgroup != $currentSubgroup && $tabLevel == 1 && $nextSubgroup === NULL) {
      $result .= "</ul></li>";
      $currentSubgroup = NULL;
      $activeSubgroup = FALSE;
    }
    // keyword always
    $result .= "<li class='key__group__list--item'>$keyword</li>";
  }
  echo $result;

  function sqlError($db, $action, $table)
  {
    echo "<p>SQL Error - Action: $action, Table: $table " .
      "</br>error num: " . mysqli_errno($db) .
      "</br>error txt: " . mysqli_error($db) . "</p>";
  }

  ?>

</body>

</html>