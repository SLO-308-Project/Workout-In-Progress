import {Machine} from "./machine";
import {Workout} from "./workout";

export interface Template
{
    _id: string;
    name: string;
    machines: Machine[];
    workout: Workout[];
}
