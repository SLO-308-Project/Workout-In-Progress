import {Workout} from "./workout";
export interface Session
{
    templateId: string | null;
    _id: string;
    date: string;
    time: number;
    workout: Workout[];
}
