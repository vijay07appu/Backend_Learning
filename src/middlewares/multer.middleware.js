import multer from 'multer';


// before uploading the file on cloudinary , first it is stored in middleware , once the file
// uploaded on the cloudinary , it is deleted from middleware

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })