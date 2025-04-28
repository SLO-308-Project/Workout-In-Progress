import { Router, Request, Response } from "express";
import setServices from "../services/setServices";
import {SetRequest} from "../types/express";

const router = Router();

// View all sets for given workoutId
router.get("/:sessionId:/:workoutId", (req: Request, res: Response) => {
    setServices
        .getSets(req.params.sessionId, req.params.workoutId)
        .then((result) => {
            // 
            return res.status(201).send(result);
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        });
});

// Create a set under given workoutId
router.post("/:sessionId/:workoutId", (req: SetRequest, res: Response) => {

    setServices
        .addSet(req.params.sessionId, req.params.workoutId, req.body.attributeValues)
        .then((result) => {
            // result contains the new setId 
            return res.status(201).send(result);
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        });
});

// Delete a set 
router.delete("/:sessionId/:workoutId/:setId", (req: Request, res: Response) => {
    setServices
        .removeSet(req.params.sessionId, req.params.workoutId, req.params.setId)
        .then((result) => {
            return res.status(204).send(result);
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        });
});
