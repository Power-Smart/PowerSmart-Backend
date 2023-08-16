import {
    getPlaces,
    getPlace,
    addPlace,
    updatePlace,
} from "../controllers/places.controller.js";
import Express from "express";


const router = Express.Router();

router.get("/:id", getPlaces);
router.get("/place/:placeID", getPlace);
router.post("/add", addPlace);
router.patch("/update/:placeID", updatePlace);


router.get("/hello", (req, res) => {
    res.send("hello");
});


export default router;
