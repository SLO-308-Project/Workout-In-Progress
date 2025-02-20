import {Router, Request, Response} from "express";
import userServices from "../services/userServices";
import {userType} from "../data/user";

//all start with /users
const router = Router();

router.post("/", (req: Request, res: Response) =>
{
    /**
     * req.body = user =
     * {
     * name: String, required
     * email: String, required
     * units: String "lbs" or "kilo" has default
     * sessionLogId: not required
     * currentSessionId: not required
     * machines: [machine: type], not required
     * }
     */
    userServices
        .addUser(req.body as userType)
        .then((result) =>
        {
            return res.status(201).send(result);
        })
        .catch((error) =>
        {
            return res.status(400).send("Bad Request: " + error);
        });
});

export default router;
