window.onload = initPage;

var keywords = [];

function initPage() {
  // get keyword list from server
  // 
  keywords.length = 0;
  submit = document.getElementById("submit").addEventListener("click", sendSearchData);

  // set listeners on each keyword
  let keywordDiv = document.getElementById("keywords");
  var ULs = keywordDiv.getElementsByTagName("ul");
  for (let i = 0; i < ULs.length; i++) {
    var LIs = ULs[i].getElementsByTagName("li");
    for (var j = 0; j < LIs.length; ++j) {
      LIs[j].addEventListener("click", keywordClicked);
    }
  }
}

function keywordClicked(event) {
  console.log("in function keywordClicked()");
  event.target.classList.toggle("key__group__list--item-selected");
  let keywordsIndex = keywords.indexOf(event.target.dataset.keyword);

  if (keywordsIndex == -1) {
    keywords.push(event.target.dataset.keyword);
  } else {
    keywords.splice(keywordsIndex, 1);
  }
}

function sendSearchData(event) {
  console.log("in function sendSearchData()");
  let dateStart = document.getElementById("date-start").value;
  let dateEnd = document.getElementById("date-end").value;
  let title = document.getElementById("title").value;

  console.log(`keywords.length = ${keywords.length}`);
  var formSearch = new FormData();
  formSearch.append("datestart", dateStart);
  formSearch.append("dateend", dateEnd);
  formSearch.append("title", title);
  for (let i = 0; i < keywords.length; i++) {
    formSearch.append("keywords[]", keywords[i]);
    console.log(`keywords[${i}]: ${keywords[i]}`);
  }
  for (let [name, value] of formSearch) {
    console.log(`${name} =  ${value}`);
  }

  var url = encodeURI("php/search.php");
  var rqst;
  try {
    rqst = new XMLHttpRequest();
  } catch (err) {
    console.log("rqsterror = " + err);
  }
  rqst.open("POST", url, true);
  rqst.onload = function () {
    console.log(rqst.response);
    document.getElementById("result").innerHTML = rqst.response;
  };
  console.log("\nsend rqst");
  rqst.send(formSearch);
}
