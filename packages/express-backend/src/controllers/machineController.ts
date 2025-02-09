/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {Request, Response} from 'express';
import machineServices from '../services/machineServices';

export const getMachines = (_req: Request, res: Response) => {
    try {
        const machines = machineServices.getMachines();
        res.status(200).json(machines);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
};

export const addMachines = (req: Request, res: Response) => {
    const { name } = req.body;
    const addedMachine = machineServices.addMachines(
        name,
    );
    res.json(addedMachine);
};

export const deleteMachine = (_req: Request, res: Response) => {
  res.status(200);
};