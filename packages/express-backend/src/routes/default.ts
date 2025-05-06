import {Router, Request, Response} from "express";
// import { userType } from "../data/user";

// all start with /machines
const router = Router();

router.get("/", (req: Request, res: Response) =>
{
    console.log(req);
     res.status(201).send("Helo world");    
});

export default router;