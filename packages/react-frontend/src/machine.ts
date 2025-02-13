export interface machineI {
    name: string;
    muscle: string;
}

export interface machineFormProp {
    handleSubmit: (machine: machineI) => void;
}

export interface machineTableProp {
    machineData: machineI[];
    removeMachine: (index: number) => void;
}
