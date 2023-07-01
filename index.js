import Express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Database & model imports
import db from "./models/index.js";

// Route imports
import mainRoute from "./routes/main.route.js";

dotenv.config();

const app = Express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json({ type: "application/*+json" }));

// Database connection
db.authenticate()
    .then(() => {
        console.log("\n>> Database connected ! <<\n");
    })
    .catch((err) => {
        console.log(err, "\n>> :( Error connecting database ! <<\n");
    });

// Routes tree setup
app.use("/", mainRoute);

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT} \nGoto : http://localhost:${PORT}`
    );
});
