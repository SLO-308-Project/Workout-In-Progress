import {Router, Request, Response} from "express";
import machineServices from "../services/machineServices";
import {machineType} from "../data/machine";


// all start with /users
const router = Router();

//create machine.
//req.body of type machine.
router.post("/:email/machines/", (req: Request, res: Response) =>
{
    /**req.body = machine =
     * {
     * name: String
     * muscle: String
     * }
     * */
    machineServices
        .addMachine(
            req.body as machineType, 
            req.params.email
        )
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
router.get("/:email/machines/", (req: Request, res: Response) =>
{
    machineServices
        .getMachines(
            req.query.name as string,
            req.query.muscle as string,
            req.params.email
        )
        .then((result) =>
        {
            console.log(result);
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
router.delete("/:email/machines/:name", (req: Request, res: Response) =>
{
    machineServices
        .deleteMachine(
            req.params.email,
            req.params.name
        )
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
router.patch(
    "/:name",
    (
        req: Request<
            {name: string},
            object,
            {name: string | undefined; muscle: string | undefined}
        >,
        res: Response,
    ) =>
    {
        machineServices
            .updateMachine(req.params.name, req.body.name, req.body.muscle)
            .then((result) =>
            {
                return res.status(200).send(result);
            })
            .catch((err) =>
            {
                res.status(400).send("Bad Request: " + err);
            });
    },
);

export default router;
