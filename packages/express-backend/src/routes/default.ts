import {Router, Request, Response} from "express";

// all start with /machines
const router = Router();

router.get("/", (req: Request, res: Response) =>
{
    console.log(req);
    res.status(200).send("Hello World");
});

export default router;
