// Type definitions for front end
// Mimics backend schema for type safety

export interface Set
{
    reps: number;
    weight: number;
}

export interface Machine
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
    workout: Machine[];
}
