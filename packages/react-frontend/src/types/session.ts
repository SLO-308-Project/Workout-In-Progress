import { Workout } from "./workout";
export interface Session
{
    _id: string;
    date: string;
    time: number;
    workout: Workout[];
}
