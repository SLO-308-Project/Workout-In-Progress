import {Router, Request, Response} from "express";
import templateServices from "../services/templateServices";

const router = Router();

router.delete("/:id", (req: Request, res: Response) =>
{
    templateServices
        .deleteTemplate(req.params.id)
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
