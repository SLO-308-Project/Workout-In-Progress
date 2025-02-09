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