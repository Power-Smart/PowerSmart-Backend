import multer from "multer";


const ProfileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/profilePictures/')
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split(".").pop();
        // const fileName = file.originalname.split(".")[0];
        // cb(null, fileName + '-' + req.params.id + "." + fileExtension);
        cb(null, req.params.id + "." + fileExtension);
    }
})


export const profileUpload = multer({ storage: ProfileStorage }).single('profile')


