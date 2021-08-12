window.onload = initPage;

var matchingPhotos = [];
var photoToDisplay=-1;

function initPage() {
    document.getElementById("flex-details").style.visibility = "hidden";
    let btnInfo = document.getElementById("infomenu");
    btnInfo.addEventListener("click", showPhotoDetails);
    let imgPhoto = document.getElementById("image");
    imgPhoto.addEventListener("click", showPhotoDetails);

    let btnPrev = document.getElementById("prev");
    btnPrev.addEventListener("click", prevPhoto);

    let btnNext = document.getElementById("next");
    btnNext.addEventListener("click", nextPhoto);

    dbOpenDB(findPhotos);
}

function showPhotoDetails() {
    console.log('button Menu pressed');
    let details = document.getElementById("flex-details");
    let photoGrid = document.getElementById("photo-grid");
    if (details.style.visibility == "hidden") {
        console.log('change to visible');
        photoGrid.style.gridColumnStart = "2";
        details.style.visibility = "visible";
    } else {
        console.log('change to hidden');
        details.style.visibility = "hidden";
        photoGrid.style.gridColumnStart = "1";
    }

}

function nextPhoto() {
    console.log('\nin function nextPhoto');
    if (++photoToDisplay >= matchingPhotos.length) {
        console.log('wrapping photos');
        photoToDisplay = 0;
    }
    displayPhoto(matchingPhotos[photoToDisplay]);
}
function prevPhoto() {
    console.log('\nin function prevPhoto');
    if (--photoToDisplay < 0) {
        console.log('wrapping photos');
        photoToDisplay = matchingPhotos.length - 1;
    }
    displayPhoto(matchingPhotos[photoToDisplay]);
}

function displayPhoto(photo) {
    // delete any existing photo details table body and create new one
    let tbl = document.getElementById('detailstbl');
    let tbody = document.getElementById('detailstbody')
    if (tbody) { tbody.remove() };
    tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'detailstbody');
    // create new table with photo tags
    for (let key in photo) {
        if (TAGS_TO_DISPLAY.includes(key) && photo[key]) {
            let tr = document.createElement('tr');

            let tdName = document.createElement('td');
            tdName.setAttribute('class', 'tdleft');
            let tagName = document.createTextNode(key);
            tdName.appendChild(tagName);
            tr.appendChild(tdName);

            let tdColon = document.createElement('td');
            tdColon.setAttribute('class', 'tdcolon');
            tdColon.appendChild(document.createTextNode(':') );
            tr.appendChild(tdColon);

            let tdInfo = document.createElement('td');
            tdInfo.setAttribute('class', 'tdleft');
            let tagInfo = document.createTextNode(photo[key]);
            tdInfo.appendChild(tagInfo)
            tr.appendChild(tdInfo);

            tbody.appendChild(tr);
        }
        tbl.appendChild(tbody);
    }

    // delete any existing file info table body and create new one
    tbl = document.getElementById('fileinfotbl');
    tbody = document.getElementById('fileinfotbody')
    if (tbody) { tbody.remove(); }
    tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'fileinfotbody');
    // split fileinfo into file name and path
    let fileparts = photo['filename'].split('/');
    let filename = fileparts[fileparts.length - 1];
    let filepath = '';
    for (let i = 1; i < fileparts.length - 1; i++) {
        filepath = filepath + ' / ' + fileparts[i];
    }
    // filename
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.setAttribute('class', 'tdleft tdsmall');
    txt = document.createTextNode(filename);
    td.appendChild(txt)
    tr.appendChild(td);
    tbody.appendChild(tr);
    // filepath
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.setAttribute('class', 'tdleft tdsmall');
    txt = document.createTextNode(filepath);
    td.appendChild(txt)
    tr.appendChild(td);
    tbody.appendChild(tr);
    tbl.appendChild(tbody);

    // map coordinates
    let map = document.getElementById('map');
    let ul = document.getElementById('coords');
    if (ul) { ul.remove(); }
    ul = document.createElement('ul');
    ul.setAttribute('id', 'coords');
    let li = document.createElement('li');
    txt = document.createTextNode('Lat: ' + photo['latitude']);
    li.appendChild(txt); ul.appendChild(li);
    li = document.createElement('li');
    txt = document.createTextNode('Lng: ' + photo['longitude']);
    li.appendChild(txt); ul.appendChild(li);
    map.appendChild(ul);

    let title = document.getElementById('title');
    // remove all text nodes
    while (title.firstChild) {
        title.removeChild(title.firstChild);
    }
    title.appendChild(document.createTextNode(photo['title']));

    let caption = document.getElementById('caption');
    // remove all text nodes
    while (caption.firstChild) {
        caption.removeChild(caption.firstChild);
    }
    caption.appendChild(document.createTextNode(photo['caption']));

    let phdate = document.getElementById('date');
    while (phdate.firstChild) {
        phdate.removeChild(phdate.firstChild);
    }
    let yr = photo['datetime'].getFullYear();
    let mon = MONTHS[photo['datetime'].getMonth()];
    let dt = photo['datetime'].getDate();
    let dy = DAYS[photo['datetime'].getDay()];
    let hr = photo['datetime'].getHours();
    hr = ('0' + hr).slice(-2);  // always 2 digits
    let mn = photo['datetime'].getMinutes();
    mn = ('0' + mn).slice(-2);  // always 2 digits
    let nbsp = String.fromCharCode(160);
    let photoDate = dy + nbsp+nbsp + yr + '-' + mon + '-' + dt + nbsp+nbsp + hr + ':' + mn;
    phdate.appendChild(document.createTextNode(photoDate) );

    let figure = document.getElementById('image');
    // remove all img nodes
    while (figure.firstChild) {
        figure.removeChild(figure.firstChild);
    }
    let img = document.createElement('img');
    let jpeg = '..' + photo['filename'];      // up a dir level to N:/JPEGs
    img.setAttribute('src', jpeg);
    img.setAttribute('class', 'photo-jpeg');
    figure.appendChild(img)
}

function dbOpenDB(handleEvent) {
    console.log('in function dbOpenDB');
    let rqstOpen = indexedDB.open("photos", 1);
    rqstOpen.callBack = handleEvent;
    //rqstOpen.taskEvent = event;

    rqstOpen.onupgradeneeded = function (event) {
        console.log('db onupgradeneeded');
        let db = event.target.result;
        switch (event.oldVersion) { // existing db version
            // create db
            case 0:
                let jpegObjStore = db.createObjectStore('jpegs', { autoIncrement: true, keyPath: 'id' });
                jpegObjStore.createIndex('keywordIdx', 'keywords', { multiEntry: true });
                jpegObjStore.createIndex('datetimeIdx', 'datetime');
                console.log('db created');
                let dirObjStore = db.createObjectStore('directories', { autoIncrement: true, keyPath: 'id' });
                dirObjStore.createIndex('directoryIdx', 'directory');
                break;
            // db exists no action needed
            default:
                console.log(`db version: ${event.oldVersion}`);
                break;
        }
    };
    rqstOpen.onerror = function (event) {
        console.log(`db open error: ${event.target.errCode}`);
    };

    rqstOpen.onsuccess = function (event) {
        console.log('db opened');
        db = event.target.result;
        rqstOpen.callBack();   // call the provided function with the original event to handle
    };
}

/*
 * findPhotos now returns all photos in the db.  
 * Eventually it will return photos that match search criteria.
 */
function findPhotos () {
    console.log('in function findPhotos')
    let txn = db.transaction("jpegs", "readonly");      // start a txn on the jpegs objectStore
    let jpegObjStore = txn.objectStore("jpegs");        // get the objectStore
    let rqstAll = jpegObjStore.getAll();
    rqstAll.onsuccess = () => {
        console.log('in function rqstAll.onsuccess')
        matchingPhotos = rqstAll.result;                // result is array of jpeg objects
        console.log(`number of matching photos: ${matchingPhotos.length}`)
        // sort photos ascending by datetime
        matchingPhotos.sort(function (a, b) {
            return (a.datetime - b.datetime);
        });
        nextPhoto();
    }
    rqstAll.onerror = () => { console.log(`findPhotos error: ${rqstKeywordSearch.error}`); }
}
