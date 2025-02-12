import {Request, Response} from "express";
import machineServices from "../services/machineServices";
import {NewMachineEntry} from "../types/machineTypes";

export const getMachines = (_req: Request, res: Response) => {
    const machines = machineServices.getMachines();
    res.status(200).json(machines);
};

export const addMachines = (req: Request, res: Response) => {
    const {name} = req.body as NewMachineEntry;
    const addedMachine = machineServices.addMachines(name);
    res.status(201).json(addedMachine);
};

export const deleteMachines = (req: Request, res: Response) => {
    const id = +req.params.id;
    const result = machineServices.deleteMachineById(id);
    if (!result) {
        res.status(404).send("Resource not found");
    } else {
        res.status(204).send();
    }
};
