import Express from "express";

const router = Express.Router();

router.get("/", async (req, res) => {
    res.send(
        "<h1 style='text-align:center;'> This is the backend server for the Web App. </h1>"
    );
});

export default router;
