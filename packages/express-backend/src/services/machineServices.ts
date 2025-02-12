import {Machine} from "../types/machineTypes";
import machines from "../data/machineData";

const getMachines = (): Machine[] => {
    return machines;
};

const addMachines = (name: string): Machine => {
    const newMachine = {
        id: Math.floor(Math.random() * 10000),
        name,
    };
    machines.push(newMachine);
    return newMachine;
};

const deleteMachineById = (id: number) => {
    const index = machines.findIndex((machine: Machine) => machine.id === id);
    if (index !== -1) {
        return machines.splice(index, 1)[0];
    } else {
        return null;
    }
};

export default {
    getMachines,
    addMachines,
    deleteMachineById,
};
