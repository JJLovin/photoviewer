import ExifReader from '../src/exif-reader.js';

document.getElementById('file').addEventListener('change', handleFile);
document.querySelector('html').setAttribute('data-initialized', '');

function handleFile(event) {
    const files = event.target.files;
    const reader = new FileReader();

//    window.exifReaderClear();

    reader.onload = function (readerEvent) {
        console.log('reader onLoad fired');
        try {
            const tags = ExifReader.load(readerEvent.target.result);
            window.exifReaderListTags(tags);
        } catch (error) {
            window.exifReaderError(error.toString());
        }
    };

    reader.readAsArrayBuffer(files[0]);
}
