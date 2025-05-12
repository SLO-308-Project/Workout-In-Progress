import {Router, Request, Response} from "express";
import workoutServices from "../services/workoutServices";
import {WorkoutRequest} from "../types/express";

// import {sessionType} from "../data/session";
// import {machineType} from "../data/machine";

const router = Router();

// Get all workouts for a session and passes it along to the client
router.get("/:sessionId", (req: Request, res: Response) =>
{
    workoutServices
        .getWorkout(req.params.sessionId, req.sub?.toString() as string)
        .then((result) =>
        {
            return res.status(201).send(result);
        })
        .catch((err) =>
        {
            console.log(err);
            return res.send(err);
        });
});

// Adds a workout with a machineid to a sessionid and passes it along to the client
router.post("/:sessionId", (req: WorkoutRequest, res: Response) =>
{
    workoutServices
        .addWorkout(
            req.body.machineId,
            req.params.sessionId,
            req.sub?.toString() as string,
        )
        .then((result) =>
        {
            return res.status(201).send(result);
        })
        .catch((err) =>
        {
            console.log(err);
            return res.send(err);
        });
});

router.delete("/:sessionId/:workoutId", (req: Request, res: Response) =>
{
    workoutServices
        .removeWorkout(
            req.params.sessionId,
            req.params.workoutId,
            req.sub?.toString() as string,
        )
        .then((result) =>
        {
            return res.status(204).send(result);
        })
        .catch((err) =>
        {
            console.log(err);
            return res.send(err);
        });
});

// router.post("/:workoutId/sets", (req: Request, res: Response) => {
//     workoutServices
//     .addSet(req.params.workoutId, req.body.attributeValues)
// })

export default router;
