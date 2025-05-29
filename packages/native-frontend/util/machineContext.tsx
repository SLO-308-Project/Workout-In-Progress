import {Machine} from "@/types/machine";
import {createContext, useContext, useState} from "react";

type Props = {
    children: JSX.Element;
};

type MachineContextType = {
    machines: Machine[];
    setMachines: (machines: Machine[]) => void;
};

const MachineContext = createContext<MachineContextType | undefined>(undefined);

export const MachineProvider = ({children}: Props) =>
{
    const [machines, setMachines] = useState<Machine[]>([]);

    return (
        <MachineContext.Provider value={{machines, setMachines}}>
            {children}
        </MachineContext.Provider>
    );
};

export const useMachineContext = () =>
{
    const context = useContext(MachineContext);
    if (!context)
    {
        throw new Error(
            "useMachineContext must be used within a machineProvider",
        );
    }
    return context;
};
