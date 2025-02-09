import {Machine} from '../types/machineTypes';

const getMachines = (): Machine[] => {
    return [
        {name: 'Leg Press'},
    ];
};

export default {
    getMachines,
};