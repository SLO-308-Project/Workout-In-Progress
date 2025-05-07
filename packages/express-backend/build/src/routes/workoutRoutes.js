"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workoutServices_1 = __importDefault(require("../services/workoutServices"));
// import {sessionType} from "../data/session";
// import {machineType} from "../data/machine";
const router = (0, express_1.Router)();
// Get all workouts for a session and passes it along to the client
router.get("/:sessionId", (req, res) => {
    workoutServices_1.default
        .getWorkout(req.params.sessionId)
        .then((result) => {
        return res.status(201).send(result);
    })
        .catch((err) => {
        console.log(err);
        return res.send(err);
    });
});
// Adds a workout with a machineid to a sessionid and passes it along to the client
router.post("/:sessionId", (req, res) => {
    workoutServices_1.default
        .addWorkout(req.body.machineId, req.params.sessionId)
        .then((result) => {
        return res.status(201).send(result);
    })
        .catch((err) => {
        console.log(err);
        return res.send(err);
    });
});
router.delete("/:sessionId/:workoutId", (req, res) => {
    workoutServices_1.default
        .removeWorkout(req.params.sessionId, req.params.workoutId)
        .then((result) => {
        return res.status(204).send(result);
    })
        .catch((err) => {
        console.log(err);
        return res.send(err);
    });
});
// router.post("/:workoutId/sets", (req: Request, res: Response) => {
//     workoutServices
//     .addSet(req.params.workoutId, req.body.attributeValues)
// })
exports.default = router;
