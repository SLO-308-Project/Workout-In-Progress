import {Router, Request, Response} from "express";
import sessionServices from "../services/sessionServices";
import {SessionType} from "../data/session";
//import {authToken} from "../util/jwt";

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
router.get("/recent", (_req: Request, res: Response) =>
{
    sessionServices
        .getCurrentSession()
        .then((result) =>
        {
            if (result.length === 1)
            {
                return res.status(200).send(result);
            }
            else
            {
                return res.status(204).send();
            }
        })
        .catch((err) =>
        {
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
        .addSession(req.body as SessionType)
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
    sessionServices
        .endSession(req.params.id)
        .then((result) =>
        {
            if (result == null)
            {
                return res.status(404).send("Session not found");
            }
            else
            {
                return res.status(201).send(result);
            }
        })
        .catch((err) =>
        {
            console.log(err);
            return res.status(400).send("Bad Request: " + err);
        });
});

// Delete a session with unique _id
router.delete("/:id", (req: Request, res: Response) =>
{
    sessionServices
        .deleteSession(req.params.id)
        .then((result) =>
        {
            if (result == null)
            {
                return res.status(404).send("Session not found");
            }
            else
            {
                return res.status(204).send();
            }
        })
        .catch((err) =>
        {
            console.log(err);
            return res.status(400).send("Bad Request: " + err);
        });
});

export default router;
