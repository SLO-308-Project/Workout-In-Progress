import {ParamsDictionary, Request} from "express-serve-static-core";
import {SessionType} from "../data/session";

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

interface Set
{
    attributeValues: {
        name: string;
        value: number;
    }[];
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

export type SetRequest = Request<ParamsDictionary, unknown, Set>;

export type SessionRequest = Request<
    ParamsDictionary,
    unknown,
    {session: SessionType}
>;
