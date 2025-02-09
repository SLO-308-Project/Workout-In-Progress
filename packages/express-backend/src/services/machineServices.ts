import {Machine} from '../types/machineTypes';
import machines from '../data/machineData';

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

export default {
    getMachines,
    addMachines,
};