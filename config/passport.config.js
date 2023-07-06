import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { users } from "../controllers/auth.controller.js";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

const passport = (passport) => {
    passport.use(
        new JwtStrategy(options, (payload, done) => {
            // const user = users.find((u) => u.username === payload.email);
            User.findOne({ where: { email: payload.email } }).then((user) => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        })
    );
};

export default passport;
