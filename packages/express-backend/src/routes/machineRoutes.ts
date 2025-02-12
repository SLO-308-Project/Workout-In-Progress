import {Router, Request, Response} from "express";
import machineServices from "../services/machineServices";

// Routes for /machines

const router = Router();

//create machine.
//req.body of type machine.
router.post("/", (req: Request, res: Response) => {
    /**req.body = machine = 
     * {
     * name: String
     * muscle: String
     * } 
     * */ 
    machineServices.addMachine(req.body)
    .then((result) =>
    {   
        return res.status(201).send(result);
    })
    .catch((err) => 
    {
        return res.status(400).send("Bad Request: " + err);
    });
});

//get machine.
//query parameters optional
//  name: string
//  muscle: string
router.get("/", (req: Request, res: Response) => {
    machineServices.getMachines(req.query.name as string | undefined, req.query.muscle as string | undefined)
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

//delete machine by it's unique name.
//path variable.
//  name: string
router.delete("/:name", (req: Request, res: Response) => {
    machineServices.deleteMachine(req.params.name)
    .then((result) => 
        {
            if (result == null)
            {
                return res.status(404).send("Resource not found");
            }
            else 
            {
                return res.status(204).send();
            }
        })
    .catch((err) => 
        {
            res.status(400).send("Bad Request: " + err);
        });
});

export default router;