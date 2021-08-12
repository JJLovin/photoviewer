window.onload = initPage
function initPage() {
    let dropzone = document.getElementById("dropzone");
    let listing = document.getElementById("listing");

    dropzone.addEventListener("dragover", function (event) {
        event.preventDefault();
    }, false);

    dropzone.addEventListener("drop", function (event) {
        let items = event.dataTransfer.items;
        event.preventDefault();
        listing.innerHTML = "";
        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();
            if (item) {
                let myphoto = document.getElementById("myphoto");
                let srcphoto = "file:///N:/Photos/1989-04-00_SantaCruz" + item.fullPath;
                console.log(`Photo location = ${srcphoto}`);
                myphoto.innerHTML = "<img src=" + srcphoto + "></img>";
                //                scanFiles(item, listing);

                /* list properties & methods of item which is a FileSystemDirectoryEntry object
                 *                                         or a FileSystemFileEntry object
                 *                                       
                                console.log(item);
                                let fsKeys = [];
                                for (let key in item) {
                                    fsKeys.push(key);
                                }
                                console.log(fsKeys);
                                fsKeys.forEach(key => {
                                    let elem = document.createElement("li");
                                    elem.innerHTML = key;
                                    listing.appendChild(elem);
                                });
                            }
                        }
                    }, false);
                */

            }
        }
    });
}

function scanFiles(item, container) {
    let elem = document.createElement("li");
    elem.innerHTML = item.isDirectory ? `Directory: ${item.name}` : item.name;
    container.appendChild(elem);

    if (item.isDirectory) {
        let directoryReader = item.createReader();
        let directoryContainer = document.createElement("ul");
        container.appendChild(directoryContainer);
        directoryReader.readEntries(function (entries) {
            entries.forEach(function (entry) {
                scanFiles(entry, directoryContainer);
            });
        });
    }
}

/*
function handleFile(event) {
    const reader = new FileReader();

    let cnt = 1;
    event.target.webkitEntries.forEach(function (entry) {
        console.log(`entry ${cnt++} = ${ entry }`);
    });
}
*/
