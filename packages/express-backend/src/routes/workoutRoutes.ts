import {Router, Request, Response} from "express";
import workoutServices from "../services/workoutServices";
import setServices from "../services/setServices";
import {WorkoutRequest, SetRequest} from "../types/express";

// import {sessionType} from "../data/session";
// import {machineType} from "../data/machine";

const router = Router();

// Get all workouts for a session and passes it along to the client
router.get("/:sessionId", (req: Request, res: Response) =>
{
    workoutServices
        .getWorkout(req.params.sessionId)
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
        .addWorkout(req.body.machineId, req.params.sessionId)
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
        .removeWorkout(req.params.sessionId, req.params.workoutId)
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

// View all sets for given workoutId
router.get("/:sessionId:/:workoutId", (req: Request, res: Response) =>
{
    setServices
        .getSets(req.params.sessionId, req.params.workoutId)
        .then((result) =>
        {
            //
            return res.status(201).send(result);
        })
        .catch((err) =>
        {
            console.log(err);
            return res.send(err);
        });
});

// Create a set under given workoutId
router.post("/:sessionId/:workoutId", (req: SetRequest, res: Response) =>
{
    console.log(`${JSON.stringify(req.body.attributeValues)}`);

    setServices
        .addSet(
            req.params.sessionId,
            req.params.workoutId,
            req.body.attributeValues,
        )
        .then((result) =>
        {
            // result contains the new setId
            return res.status(201).send(result);
        })
        .catch((err) =>
        {
            console.log(err);
            return res.send(err);
        });
});

// Delete a set
router.delete(
    "/:sessionId/:workoutId/:setId",
    (req: Request, res: Response) =>
    {
        setServices
            .removeSet(
                req.params.sessionId,
                req.params.workoutId,
                req.params.setId,
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
    },
);

export default router;
