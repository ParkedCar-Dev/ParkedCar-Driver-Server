const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userTable = db.driver;

const users = {}

module.exports = class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.json({ status: "error", message: "Invalid form submission.", token: null, refreshToken: null });
            }
            const user = await userTable.findOne({ where: { email: email } });
            if (!user) {
                return res.json({ status: "error", message: "Invalid email or password.", token: null, refreshToken: null });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.json({ status: "error", message: "Invalid email or password.", token: null, refreshToken: null });
            }
            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            const refreshToken = crypto.randomBytes(64).toString("hex");
            users[refreshToken] = user.user_id;
            return res.json({ status: "success", message: "User logged in successfully.", token: token, refreshToken: refreshToken });
        } catch (err) {
            console.error(err.message);
            return res.json({ status: "error", message: "Something went wrong.", token: null, refreshToken: null });
        }
    }

    static async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.json({ status: "error", message: "Invalid form submission.", token: null });
            }
            const userId = users[refreshToken];
            if (!userId) {
                return res.json({ status: "error", message: "Invalid refresh token.", token: null });
            }
            const user = await userTable.findOne({ where: { user_id: userId } });
            if (!user) {
                return res.json({ status: "error", message: "Invalid refresh token.", token: null });
            }
            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ status: "success", message: "Token refreshed successfully.", token: token });
        } catch (err) {
            console.error(err.message);
            return res.json({ status: "error", message: "Something went wrong.", token: null });
        }
    }

    static async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.json({ status: "error", message: "Invalid form submission." });
            }
            const userId = users[refreshToken];
            if (!userId) {
                return res.json({ status: "error", message: "Invalid refresh token." });
            }
            delete users[refreshToken];
            return res.json({ status: "success", message: "User logged out successfully." });
        } catch (err) {
            console.error(err.message);
            return res.json({ status: "error", message: "Something went wrong." });
        }
    }
}

