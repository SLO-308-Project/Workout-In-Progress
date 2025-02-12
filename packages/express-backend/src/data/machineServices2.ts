import machineSchema from "./machine";
import machine from "../data/machine";
//import {Body} from "express";

function addMachine(machine: machine)
{
    const machineToAdd = new machineSchema(machine);
    const prom = machineToAdd.save();
    return prom;
}

function getMachines(name: string, muscle: string)
{   
    let result;
    if (!name && !muscle)
    {
        result = machineSchema.find();
    }
    else if (name && !muscle)
    {
        result = machineSchema.find({name: name});
    } 
    else if (!name && muscle)
    {
        result = machineSchema.find({muscle: muscle});
    }
    else //name and muscle
    {
        result = machineSchema.find({name: name, muscle: muscle});
    }
    return result;
}

function stupid(){
    return 5;
}
export default 
    {
        addMachine,
        getMachines,
        stupid
    };