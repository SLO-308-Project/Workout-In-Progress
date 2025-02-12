import {Router, Request, Response} from "express";
import { deleteMachines, } from "../controllers/machineController";
import machineServices2 from "../data/machineServices2";
import machine from "../data/machine";

const router = Router();
router.post("/", (req: Request, res: Response) => {
    const parsedBody = machine.parsedBody(req.body);
    res.send(machineServices2.addMachine(parsedBody.data));
});

router.delete("/:id", deleteMachines);

export default router;
