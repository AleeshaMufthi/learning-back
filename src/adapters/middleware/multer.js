import multer from "multer";
import path from "path"

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    },
  });

  // check file type 
  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/; // allowed file extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if(mimetype && extname){
      return cb(null, true);
    }else{
      cb('Error: Images only')
    }
  }

  // Initialize upload
export const upload = multer({ 
    storage: storage,
    limits: {fileSize: 10 * 1024 * 1024 }, //max size 1 mb
    fileFilter: (req, file, cb) => {     
    checkFileType(file, cb)
  },
 }).single('profilePicture')
