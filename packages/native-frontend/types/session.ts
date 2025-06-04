import {Workout} from "./workout";
export interface Session
{
    template_id: string | null;
    _id: string;
    date: string;
    time: number;
    workout: Workout[];
}
