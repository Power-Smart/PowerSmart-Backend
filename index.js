import Express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import passport from "passport";
import cookieparser from "cookie-parser";
import passportConfig from "./config/passport.config.js";

// Database & model imports
import db from "./models/index.js";

// Route imports
import mainRoute from "./routes/main.route.js";
import authRoute from "./routes/auth.route.js";
import protectedRoute from "./routes/protected.route.js";

dotenv.config();
passportConfig(passport);

const app = Express();
const PORT = process.env.PORT || 3001;

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieparser());
// app.use(bodyParser.json({ type: "application/*+json" }));

// Database connection
db.sync({ alter: true })
    .then(() => {
        console.log("\n>> Database connected ! <<\n");
    })
    .catch((err) => {
        console.log(err, "\n>> :( Error connecting database ! <<\n");
    });

// Routes tree setup
app.use("/", mainRoute);
app.use("/auth", authRoute);
app.use(
    "/protected",
    passport.authenticate("jwt", { session: false }),
    protectedRoute
);

// server setup
app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT} \nGoto : http://localhost:${PORT}`
    );
});
