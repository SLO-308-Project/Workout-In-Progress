"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionServices_1 = __importDefault(require("../services/sessionServices"));
//import {authToken} from "../util/jwt";
const router = (0, express_1.Router)();
// Get all sessions
router.get("/", (_req, res) => {
    sessionServices_1.default
        .getAllSessions()
        .then((result) => {
        return res.status(200).send(result);
    })
        .catch((err) => {
        console.log(err);
        return res.send("Error: " + err);
    });
});
// Get most recent session with no time (0 default)
router.get("/recent", (_req, res) => {
    sessionServices_1.default
        .getCurrentSession()
        .then((result) => {
        if (result.length === 1) {
            return res.status(200).send(result);
        }
        else {
            return res.status(204).send();
        }
    })
        .catch((err) => {
        console.log(err);
        return res.send("Error: " + err);
    });
});
// Get a session by id
router.get("/:id", (req, res) => {
    sessionServices_1.default
        .getSessionById(req.params.id)
        .then((result) => {
        return res.status(200).send(result);
    })
        .catch((err) => {
        console.log(err);
        return res.send("Error: " + err);
    });
});
// Create a session
router.post("/", (req, res) => {
    sessionServices_1.default
        .addSession(req.body)
        .then((result) => {
        return res.status(201).send(result);
    })
        .catch((err) => {
        return res.status(400).send("Bad Request: " + err);
    });
});
// Updates a session with end time
router.put("/:id", (req, res) => {
    sessionServices_1.default
        .endSession(req.params.id)
        .then((result) => {
        if (result == null) {
            return res.status(404).send("Session not found");
        }
        else {
            return res.status(201).send(result);
        }
    })
        .catch((err) => {
        console.log(err);
        return res.status(400).send("Bad Request: " + err);
    });
});
// Delete a session with unique _id
router.delete("/:id", (req, res) => {
    sessionServices_1.default
        .deleteSession(req.params.id)
        .then((result) => {
        if (result == null) {
            return res.status(404).send("Session not found");
        }
        else {
            return res.status(204).send();
        }
    })
        .catch((err) => {
        console.log(err);
        return res.status(400).send("Bad Request: " + err);
    });
});
exports.default = router;
