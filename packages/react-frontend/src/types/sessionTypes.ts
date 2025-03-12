// Type definitions for front end
// Mimics backend schema for type safety

export interface Set
{
    attributeValues: {
        name: string,
        value: number
    };
    weight: number;
}

export interface Machine {
    _id: string;
    name: string;
}

export interface Workout 
{
    _id: string;
    machineId: string;
    sets: Set[];
}

export interface Session
{
    _id: string;
    date: string;
    time: number;
    workout: Workout[];
}
