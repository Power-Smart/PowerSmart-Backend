import multer from "multer";
import fs from "fs";
import { deleteProfile } from "../controllers/user.controller.js";


const ProfileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/profilePictures/customer/')
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split(".").pop();
        const fileName = file.originalname.split(".")[0];
        // cb(null, fileName + '-' + req.params.id + "." + fileExtension);
        cb(null, fileName + "." + fileExtension);

        // cb(null, req.params.id + "." + fileExtension);
    }
})


export const profileUpload = multer({ storage: ProfileStorage }).single('profile')


export const picDelete = async (req, res) => {
    const picName = req.params.picName;
    try {
        fs.unlinkSync(`data/profilePictures/customer/${picName}`);
        deleteProfile();
        console.log("Successfully deleted the file.");
        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
}


