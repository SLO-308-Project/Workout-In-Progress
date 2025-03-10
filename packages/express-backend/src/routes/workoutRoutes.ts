import { Router, Request, Response } from "express";
import workoutServices from "../services/workoutServices";
// import {sessionType} from "../data/session";
// import {machineType} from "../data/machine";

const router = Router();

// Get all workouts for a session and passes it along to the client
router.get("/:sessionId", (req: Request, res: Response) => {
    workoutServices
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
router.post("/:sessionId", (req: Request, res: Response) => {
    workoutServices
        .addWorkout(req.body.machineId, req.params.sessionId)
        .then((result) => {
            return res.status(201).send(result);
        }).catch((err) => {
            console.log(err);
            return res.send(err);
        });
});


export default router;
