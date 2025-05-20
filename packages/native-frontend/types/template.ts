import {Machine} from "./machine";

export interface Template
{
    _id: string;
    name: string;
    machines: Machine[];
    workout: [
        {
            _id: string;
            machineId: string;
            sets: [
                {
                    _id: string;
                    attributeValues: string;
                },
            ];
        },
    ];
    //  Template
    //      _id
    //      name:
    //      machines:
    //          machine[]
    //      workouts:
    //          workout[]
}
