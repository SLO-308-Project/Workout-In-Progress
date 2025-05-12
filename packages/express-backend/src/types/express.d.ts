import {ParamsDictionary, Request} from "express-serve-static-core";

// Interfaces for types
interface WorkoutMachineAttributes
{
    machineId: string;
}

interface MachineAttributes
{
    name: string;
    unit: string;
}

// Request Types
export type WorkoutRequest = Request<
    ParamsDictionary,
    unknown,
    WorkoutMachineAttributes
>;

export type MachineRequest = Request<
    ParamsDictionary,
    unknown,
    MachineAttributes
>;

declare global
{
    namespace Express
    {
        export interface Request
        {
            sub?: string | (() => string);
        }
    }
}
