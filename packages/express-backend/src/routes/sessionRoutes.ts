import {Router, Request, Response} from "express";
import sessionServices from "../services/sessionServices";
import {sessionType} from "../data/session";

const router = Router();

// Get all sessions
router.get("/", (_req: Request, res: Response) =>
{
    sessionServices
        .getAllSessions()
        .then((result) =>
        {
            return res.status(200).send(result);
        })
        .catch((err) =>
        {
            console.log(err);
            return res.send("Error: " + err);
        });
});

// Get most recent session with no time (0 default)
router.get("/recent", (_req: Request, res: Response) => {
    sessionServices
        .getCurrentSession()
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            console.log(err);
            return res.send("Error: " + err);
        });
});

// Get a session by id
router.get("/:id", (req: Request, res: Response) =>
    {
        sessionServices
            .getSessionById(req.params.id)
            .then((result) =>
            {
                return res.status(200).send(result);
            })
            .catch((err) =>
            {
                console.log(err);
                return res.send("Error: " + err);
            });
    });
    

// Create a session
router.post("/", (req: Request, res: Response) =>
{
    sessionServices
        .addSession(req.body as sessionType)
        .then((result) =>
        {
            return res.status(201).send(result);
        })
        .catch((err) =>
        {
            return res.status(400).send("Bad Request: " + err);
        });
});

// Updates a session with end time
router.put("/:id", (req: Request, res: Response) => 
{
    console.log(req.params.id);
    sessionServices
        .endSession(req.params.id)
        .then((result) => {
            if (result == null) {
                return res.status(404).send("Session not found");
            } else {
                return res.status(201).send(result);
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).send("Bad Request: " + err);
        });
});

// Delete a session with unique _id
router.delete("/:id", (req: Request, res: Response) => {
    sessionServices
        .deleteSession(req.params.id)
        .then((result) => {
            if (result == null) {
                return res.status(404).send("Session not found");
            } else {
                return res.status(204).send();
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).send("Bad Request: " + err);
        });
});


export default router;
