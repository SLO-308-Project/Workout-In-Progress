import {Router, Request, Response} from "express";
import machineServices from "../services/machineServices";
import {machineType} from "../data/machine";
// import { userType } from "../data/user";

// all start with /machines
const router = Router();

//create machine.
//req.body of type machine.
router.post("/:userEmail/", (req: Request, res: Response) =>
{
    /**req.body = machine =
     * {
     * name: String
     * muscle: String
     * }
     * */
    machineServices
        .addMachine(req.body as machineType, req.params.userEmail)
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
//returns a list of machines.
router.get("/:userEmail/", (req: Request, res: Response) =>
{
    machineServices
        .getMachines(
            req.query.name as string,
            req.query.muscle as string,
            req.params.userEmail,
        )
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
router.delete("/:userEmail/:name", (req: Request, res: Response) =>
{
    machineServices
        .deleteMachine(req.params.userEmail, req.params.name)
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

//update machine by its unique name.
//Body can have any attribute of machineType. 
//Cannot accept null or undefined attributes.
//result is the machine's previous values before update.
router.patch("/:userEmail/:name", (req: Request, res: Response) =>
{
    machineServices
        .updateMachine(
            req.params.userEmail,
            req.params.name,
            req.body as machineType,
        )
        .then((result) =>
        {
            return res.status(200).send(result);
        })
        .catch((err) =>
        {
            res.status(400).send("Bad Request: " + err);
        });
});

export default router;
