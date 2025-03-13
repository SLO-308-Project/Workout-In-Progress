import { Set } from "./set"
export interface Workout 
{
    _id: string;
    machineId: string;
    sets: Set[];
}
