//Extract EXIF data from JPEG

import ExifReader from "../exif/exif-reader.js";
import {
  CAPTION_ABSTRACT,
  OBJECT_NAME,
  MODEL,
  MAKE,
  LENS,
  EXPOSURE,
  FSTOP,
  FOCAL_LENGTH,
  ISO,
  LATITUDE,
  LATITUDE_REF,
  LONGITUDE,
  LONGITUDE_REF,
  ALTITUDE,
  FLASH,
  DATE_TIME_ORIGINAL,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  KEYWORDS,
  HIERARCHICAL_SUBJECT,
} from "./constants.js";
import Jpeg from ".constants.js";

function recordTags(readerEvent) {
  let fileName = readerEvent.target.filePath;
  const tags = ExifReader.load(readerEvent.target.result);
  let photo = new Jpeg(fileName);

  if (tags[OBJECT_NAME] != undefined && tags[OBJECT_NAME].description != undefined) {
    photo.title = tags[OBJECT_NAME].description;
  } else {
    photo.title = "";
  }
  if (tags[CAPTION_ABSTRACT] != undefined && tags[CAPTION_ABSTRACT].description != undefined) {
    photo.caption = tags[CAPTION_ABSTRACT].description;
  } else {
    photo.caption = "";
  }
  if (tags[MAKE] != undefined && tags[MAKE].description != undefined) {
    photo.make = tags[MAKE].description;
  } else {
    photo.make = "";
  }
  if (tags[MODEL] != undefined && tags[MODEL].description != undefined) {
    if (tags[MODEL].description.startsWith("Canon")) {
      //remove vendor name from Model tag
      photo.model = tags[MODEL].description.slice(6);
    } else if (tags[MODEL].description.startsWith("HP")) {
      //remove vendor name from Model tag
      photo.model = tags[MODEL].description.slice(3);
    } else {
      photo.model = tags[MODEL].description;
    }
  } else {
    photo.model = "";
  }
  if (tags[LENS] != undefined && tags[LENS].description != undefined) {
    photo.lens = tags[LENS].description;
  } else {
    photo.lens = "";
  }
  if (tags[EXPOSURE] != undefined && tags[EXPOSURE].description != undefined) {
    photo.exposure = tags[EXPOSURE].description;
  } else {
    photo.exposure = "";
  }
  if (tags[FSTOP] != undefined && tags[FSTOP].description != undefined) {
    photo.fstop = tags[FSTOP].description;
  } else {
    photo.fstop = "";
  }
  if (tags[FOCAL_LENGTH] != undefined && tags[FOCAL_LENGTH].description != undefined) {
    photo.focal = tags[FOCAL_LENGTH].description;
  } else {
    photo.focal = "";
  }
  if (tags[ISO] != undefined && tags[ISO].description != undefined) {
    photo.iso = tags[ISO].description;
  } else {
    photo.iso = "";
  }
  if (tags[IMAGE_HEIGHT] != undefined && tags[IMAGE_HEIGHT].description != undefined) {
    photo.height = tags[IMAGE_HEIGHT].description;
  } else {
    photo.height = "";
  }
  if (tags[IMAGE_WIDTH] != undefined && tags[IMAGE_WIDTH].description != undefined) {
    photo.width = tags[IMAGE_WIDTH].description;
  } else {
    photo.width = "";
  }
  if (tags[FLASH] != undefined && tags[FLASH].description != undefined) {
    if (tags[FLASH].description.includes("fired")) {
      photo.flash = true;
    } else {
      photo.flash = false;
    }
  }
  if (tags[LATITUDE] != undefined && tags[LATITUDE].description != undefined) {
    photo.longitude = tags[LATITUDE].description;
  } else {
    photo.longitude = "";
  }
  if (tags[LATITUDE_REF] != undefined && tags[LATITUDE_REF].description != undefined) {
    photo.longitudeRef = tags[LATITUDE_REF].description;
  } else {
    photo.longitudeRef = "";
  }
  if (tags[LONGITUDE] != undefined && tags[LONGITUDE].description != undefined) {
    photo.longitude = tags[LONGITUDE].description;
  } else {
    photo.longitude = "";
  }
  if (tags[LONGITUDE_REF] != undefined && tags[LONGITUDE_REF].description != undefined) {
    photo.longitudeRef = tags[LONGITUDE_REF].description;
  } else {
    photo.longitudeRef = "";
  }
  if (tags[ALTITUDE] != undefined && tags[ALTITUDE].description != undefined) {
    photo.altitude = tags[ALTITUDE].description;
  } else {
    photo.altitude = "";
  }
  if (tags[DATE_TIME_ORIGINAL] != undefined && tags[DATE_TIME_ORIGINAL].description != undefined) {
    let dto = tags[DATE_TIME_ORIGINAL].description;
    let year = dto.slice(0, 4);
    let month = dto.slice(5, 7) - 1;
    let day = dto.slice(8, 10);
    let hour = dto.slice(11, 13);
    let minute = dto.slice(14, 16);
    let second = dto.slice(17);
    photo.datetime = new Date(year, month, day, hour, minute, second);
  } else {
    photo.datetime = new Date(1900, 0, 1, 0, 0, 0, 0); // 1-Jan-1900 00:00:00
  }
  if (tags[KEYWORDS] == undefined) {
    photo.keywords[0] = "";
  } else {
    let keywords = [];
    if (typeof tags[KEYWORDS].description == "string") {
      keywords = tags[KEYWORDS].description.split(",");
    } else if (Array.isArray(tags[KEYWORDS])) {
      for (let k = 0; k < tags[KEYWORDS].length; k++) {
        keywords.push(tags[KEYWORDS][k].description);
      }
    } else {
      photo.keywords[0] = "";
    }
    for (let i = 0; i < keywords.length; i++) {
      photo.keywords[i] = keywords[i].trim();
      if (photo.keywords[i].startsWith("_")) {
        photo.keywords.splice(i, 1); // remove LR keyword groups names
      }
    }
  }
  console.log(JSON.stringify(photo));
}
