import machineSchema, {machineType} from "../data/machine";

//import {Body} from "express";

//adds a machine.
function addMachine(machineJSON: machineType)
{
    const machineToAdd = new machineSchema(machineJSON);
    const prom = machineToAdd.save();
    return prom;
}

//gets machine's based on parameters.
function getMachines(name: string | undefined, muscle: string | undefined)
{
    console.log(name + "  " + muscle);
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
    //name and muscle
    else
    {
        result = machineSchema.find({name: name, muscle: muscle});
    }
    return result;
}

//deletes a machine by it's unique name.
function deleteMachine(name: string)
{
    return machineSchema.findOneAndDelete({name: name});
}

//updates a machine based on parameters
function updateMachine(
    currentName: string,
    newName: string | undefined,
    newMuscle: string | undefined,
)
{
    let result;
    if (newName && newMuscle)
    {
        result = machineSchema.findOneAndUpdate(
            {name: currentName},
            {
                name: newName,
                muscle: newMuscle,
            },
            {new: true},
        );
    }
    else if (newName && !newMuscle)
    {
        result = machineSchema.findOneAndUpdate(
            {name: currentName},
            {name: newName},
            {new: true},
        );
    }
    else if (!newName && newMuscle)
    {
        result = machineSchema.findOneAndUpdate(
            {name: currentName},
            {muscle: newMuscle},
            {new: true},
        );
        // if no parameters given return original machine
    }
    else
    {
        result = machineSchema.find({name: currentName});
    }
    return result;
}

export default {
    addMachine,
    getMachines,
    deleteMachine,
    updateMachine,
};
