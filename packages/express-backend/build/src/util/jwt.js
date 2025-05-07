"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.authToken = authToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
// Create JWT
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user._id }, (0, env_1.getEnv)("JWT_SECRET"), {
        algorithm: "HS256",
        expiresIn: "1h",
    });
}
// Middleware for JWT authentication, import and add to backend routes for pages that should require authentication
// ex: router.get("/", authToken, (_req: Request, res: Response) =>
function authToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        console.log("No token received");
        res.status(401).send("Authentication required");
    }
    else {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, (0, env_1.getEnv)("JWT_SECRET"));
            console.log("Decoded token: ", decoded);
            next();
        }
        catch (err) {
            console.error(err);
            res.status(401).send(err);
        }
    }
}
