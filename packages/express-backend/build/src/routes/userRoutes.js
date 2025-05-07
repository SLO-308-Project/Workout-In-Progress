"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userServices_1 = __importDefault(require("../services/userServices"));
const password_1 = require("../util/password");
const jwt_1 = require("../util/jwt");
//all start with /users
const router = (0, express_1.Router)();
router.post("/register", (req, res) => {
    /**
     * req.body = user =
     * {
     * name: String, required
     * email: String, required
     * password: String, required
     * units: String "lbs" or "kilo" has default
     * sessionLogId: not required
     * currentSessionId: not required
     * machines: [machine: type], not required
     * }
     */
    const userData = req.body;
    // Make sure email and password are provided
    if (!userData.password || !userData.email) {
        res.status(400).send("Bad request: Invalid input data.");
    }
    else {
        // Check if user exists already, create if not.
        userServices_1.default
            .getUser(userData.email)
            .then((userExists) => __awaiter(void 0, void 0, void 0, function* () {
            if (userExists) {
                return res.status(409).send("User already exists");
            }
            else {
                userData.password = yield (0, password_1.hashPassword)(userData.password);
                yield userServices_1.default.addUser(userData);
                return res.status(201).send("User added successfully");
            }
        }))
            .catch((error) => {
            return res.status(400).send("Bad Request: " + error);
        });
    }
});
router.post("/login", (req, res) => {
    const userEmail = req.body.email;
    const password = req.body.password;
    userServices_1.default
        .getUser(userEmail, true)
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user) {
            // Check for valid password
            const isValid = yield (0, password_1.verifyPassword)(user.password, password);
            if (isValid) {
                const token = (0, jwt_1.generateAccessToken)(user);
                res.status(200).send(token);
            }
            else {
                res.status(401).send("Unauthorized");
            }
        }
        else {
            // User not found (invalid email login)
            res.status(401).send("Unauthorized");
        }
    }))
        .catch((error) => {
        res.status(400).send("Bad Request: " + error);
    });
});
exports.default = router;
