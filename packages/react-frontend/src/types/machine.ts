import { Unit } from "./unit";

export interface Machine {
    _id: string;
    name: string;
    muscle: string;
    attributes: {
        name: string;
        unit: Unit;
    }[]
}
