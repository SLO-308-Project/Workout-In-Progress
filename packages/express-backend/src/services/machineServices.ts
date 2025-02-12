import machineSchema, {machineType} from "../data/machine";

//import {Body} from "express";

//adds a machine.
function addMachine(machineJSON: machineType) {
    const machineToAdd = new machineSchema(machineJSON);
    const prom = machineToAdd.save();
    return prom;
}

//gets machine's based on parameters.
function getMachines(name: string | undefined, muscle: string | undefined) {
    console.log(name + "  " + muscle);
    let result;
    if (!name && !muscle) {
        result = machineSchema.find();
    } else if (name && !muscle) {
        result = machineSchema.find({name: name});
    } else if (!name && muscle) {
        result = machineSchema.find({muscle: muscle});
    }
    //name and muscle
    else {
        result = machineSchema.find({name: name, muscle: muscle});
    }
    return result;
}

//deletes a machine by it's unique name.
function deleteMachine(name: string) {
    return machineSchema.findOneAndDelete({name: name});
}

export default {
    addMachine,
    getMachines,
    deleteMachine,
};
