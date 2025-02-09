export interface Machine {
    id: number;
    name: string;
}

export type NewMachineEntry = Omit<Machine, 'id'>;