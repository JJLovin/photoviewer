// Upload Tasks
export const CHOOSE_FILES = 0;
export const GET_SELECTED_FILES = 1;
export const GET_DROPPED_FILES = 2;
export const VERIFY_FILES = 3;
export const GET_FOLDER_LIST = 4;
export const UNUSED = 5;
export const RECORD_DIRECTORY = 6;
export const SEND_TO_SERVER = 7;
export const PROCESS_SERVER_RESULT = 8;
export const CONFIRM_DUPLICATE_FILES = 9;
export const CANCEL_UPLOAD = 100;
export const AJAX_ERROR = 200;
export const PROGRAM_ERROR = 300;

// export constants for ExifReader tags
export const CAPTION_ABSTRACT = "Caption/Abstract"; //caption
export const OBJECT_NAME = "Object Name"; //title
export const MODEL = "Model";
export const MAKE = "Make";
export const LENS = "LensModel";
export const EXPOSURE = "ExposureTime";
export const FSTOP = "FNumber";
export const FOCAL_LENGTH = "FocalLength";
export const ISO = "ISOSpeedRatings";
export const LATITUDE = "GPSLatitude";
export const LATITUDE_REF = "GPSLatitudeRef";
export const LONGITUDE = "GPSLongitude";
export const LONGITUDE_REF = "GPSLongitudeRef";
export const ALTITUDE = "GPSAltitude";
export const FLASH = "Flash";
export const DATE_TIME_ORIGINAL = "DateTimeOriginal";
export const IMAGE_HEIGHT = "Image Height";
export const IMAGE_WIDTH = "Image Width";
export const KEYWORDS = "Keywords";
export const HIERARCHICAL_SUBJECT = "hierarchicalSubject"; // keywords as LR hierarchy

// Exif tags to display in photo details pane
const TAGS_TO_DISPLAY = ["camera", "lens", "seconds", "fstop", "iso", "focal", "flash", "pixels"];

// export constants for database tasks
export const DB_ADD_PHOTO = 1;
export const DB_SEARCH = 2;
export const DB_DELETE_PHOTO = 3;
export const DB_DELETE_DATABASE = 4;

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jly", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// export constants for error messages
export const ERR_TOO_MANY_FOLDERS = "Only one folder may be uploaded";
export const ERR_NOT_FILE_NOT_FOLDER = "Only files or directories may be uploaded";
export const ERR_FILE_AND_FOLDER = "Either a directory or files may be uploaded, not both";
export const ERR_NO_FOLDER_NAME = "Internal error: no directory specified for upload";

export class Jpeg {
  constructor(filename) {
    this.id;
    this.filename = filename;
    this.title;
    this.caption;
    this.camera;
    this.lens;
    this.flash;
    this.seconds;
    this.fstop;
    this.focal;
    this.iso;
    this.height;
    this.width;
    this.latitude;
    this.latitudeRef;
    this.longitude;
    this.longtitudeRef;
    this.altitude;
    this.datetime;
    this.keywords = [];
  }
}

export class Folder {
  constructor(directory) {
    this.id;
    this.name;
    this.fullPath = directory;
    this.description;
    this.states = [];
    this.countries = [];
    this.datetime;
  }
}

class Search {
  constructor() {
    this.keywords = [];
    this.dateStart;
    this.dateEnd;
  }
}
