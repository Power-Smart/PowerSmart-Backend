import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        User.findOne({ where: { email: email } }).then(async (user) => {
            if (user) {
                return res.status(400).json({ message: "User already exists" });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = await User.create({
                    email: email,
                    password: hashedPassword,
                    name: name,
                    role: 1,
                });
                await newUser.save();
                res.status(201).json({
                    message: "User created successfully",
                    user: {
                        email,
                        name,
                    },
                });
            }
        });
    } catch (e) {
        res.status(500).send();
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        User.findOne({
            where: { email: email },
            attributes: ["user_id", "name", "email", "password", "role"],
        }).then(async (user) => {
            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Invalid username or password" });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res
                    .status(400)
                    .json({ message: "Invalid username or password" });
            }

            const token = jwt.sign(
                {
                    email: user.email,
                    id: user.user_id,
                    name: user.name,
                    role: user.role,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            const refreshToken = jwt.sign(
                { email: user.email },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: "1d",
                }
            );
            await User.update(
                { refresh_token: refreshToken },
                { where: { email: email } }
            );
            return res.json({
                id: user.user_id,
                role: user.role,
                email: user.email,
                name: user.name,
                token,
                refreshToken,
            });
        });
    } catch (e) {
        res.status(500).send();
    }
};

export const refreshToken = async (req, res) => {
    let refreshToken = req.body?.refreshToken || req.cookies?.refresh;
    if (!refreshToken) {
        return res.status(403).json({ message: "No refresh token" });
    }
    User.findOne({ where: { refresh_token: refreshToken } }).then((user) => {
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        // verify refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid token" });
                } else {
                    // Create new access token
                    const newToken = jwt.sign(
                        { email: user.email },
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: "1h",
                        }
                    );
                    res.json({ message: "new token created", token: newToken });
                }
            }
        );
    });
};

export const logout = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    User.findOne({ where: { refresh_token: refreshToken } }).then((user) => {
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        User.update(
            { refresh_token: null },
            { where: { refresh_token: refreshToken } }
        ); // need to handle exception here
        res.clearCookie("refresh");
        res.status(201).json({ message: "Logged out successfully" });
    });
};
