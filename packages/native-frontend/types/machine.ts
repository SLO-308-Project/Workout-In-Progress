import {Attribute} from "./attribute";

export interface Machine
{
    _id: string;
    name: string;
    muscle: string;
    attributes: Attribute[];
}
