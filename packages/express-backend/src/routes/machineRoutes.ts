import {Router, Request, Response} from "express";
import machineServices from "../services/machineServices";
import {MachineType} from "../data/machine";
import {MachineRequest} from "../types/express";

// all start with /machines
const router = Router();

//create machine.
//req.body of type machine.
/**req.body = machine =
 * {
 * name: String
 * muscle: String
 * }
 * */
router.post("/", (req: Request, res: Response) =>
{
    machineServices
        .addMachine(req.body as MachineType, req.sub?.toString() as string)
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
router.get("/", (req: Request, res: Response) =>
{
    machineServices
        .getMachines(
            req.query.name as string,
            req.query.muscle as string,
            req.sub?.toString() as string,
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
router.delete("/:name", (req: Request, res: Response) =>
{
    machineServices
        .deleteMachine(req.sub?.toString() as string, req.params.name)
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
            if (err instanceof Error)
            {
                const msg = err.message;
                if (
                    msg.includes("No machines found") ||
                    msg.includes("User not found")
                )
                {
                    return res.status(404).send(err.message);
                }
                else if (msg.includes("Machine log update failed"))
                {
                    return res.status(500).send(err.message);
                }
            }
            return res.status(400).send("Bad Request: " + err);
        });
});

//update machine by its unique name.
//Body can have any attribute of machineType.
//Cannot accept null or undefined attributes.
//result is the machine's previous values before update.
router.patch("/:name", (req: Request, res: Response) =>
{
    machineServices
        .updateMachine(
            req.sub?.toString() as string,
            req.params.name,
            req.body as MachineType,
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

// get attributes for a machineid
router.get("/:id/attributes", (req: Request, res: Response) =>
{
    machineServices
        .getAttributes(req.params.id)
        .then((result) =>
        {
            return res.status(200).send(result);
        })
        .catch((err) =>
        {
            res.status(400).send("Bad Request: " + err);
        });
});

// post an attribute for a machineid
router.post("/:id/attributes", (req: MachineRequest, res: Response) =>
{
    machineServices
        .addAttribute(req.params.id, req.body.name, req.body.unit)
        .then((result) =>
        {
            return res.status(201).send(result);
        })
        .catch((err) =>
        {
            console.log(err);
        });
});

// delete an attribute for a machineid given its name
router.delete("/:id/attributes/:attrName", (req: Request, res: Response) =>
{
    machineServices
        .deleteAttribute(req.params.id, req.params.attrName)
        .then((result) =>
        {
            if (!result)
            {
                res.status(404).send();
            }
            else
            {
                res.status(204).send();
            }
        })
        .catch((err) =>
        {
            console.log(err);
            res.status(400).send("Bad Request: " + err);
        });
});

export default router;
