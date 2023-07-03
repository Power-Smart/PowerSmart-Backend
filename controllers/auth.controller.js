import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();
export const users = [];

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        users.push(newUser);
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).send();
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = users.find((u) => u.username === username);

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
            { username: user.username },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1h",
            }
        );

        const refreshToken = crypto.randomBytes(64).toString("hex");
        user.refreshToken = refreshToken;

        res.json({ message: "Logged in successfully", token, refreshToken });
    } catch (e) {
        console.log(e.message);
    }
};

export const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    const user = users.find((u) => u.refreshToken === refreshToken);
    if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
    const newToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );
    res.json({ message: "new token created", token: newToken });
};

export const logout = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    const user = users.find((u) => u.refreshToken === refreshToken);
    if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
    user.refreshToken = null;
    res.status(201).json({ message: "Logged out successfully" });
};
