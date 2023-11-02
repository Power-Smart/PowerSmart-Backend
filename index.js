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
import routes from "./routes/routes.js";
import protectedRoute from "./routes/protected.route.js";

dotenv.config();
passportConfig(passport);

const app = Express();
const PORT = process.env.PORT || 3001;

// app.use(
//     cors({
//         origin: "http://localhost:5173",
//     })
// );
app.use(cors());
app.use(passport.initialize());
app.use((req, res, next) => {
    if (req.is('application/x-www-form-urlencoded')) {
        bodyParser.urlencoded({ extended: false })(req, res, next);
    } else {
        next();
    }
});
app.use(Express.json());
app.use(cookieparser());

import "./models/foreignKeys.js";
import router from "./routes/auth.route.js";

// Database connection
db.authenticate()
    .then(() => {
        console.log("\n>> Database connected ! <<\n");
    })
    .catch((err) => {
        console.log(err, "\n>> :( Error connecting database ! <<\n");
    });

// Routes tree setup
app.use("/", routes);
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
