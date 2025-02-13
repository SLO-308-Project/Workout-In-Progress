// src/app.tsx
import {useState} from "react";
import {machineI} from "./machine";
import MachineTable from "./machineTable";
import MachineForm from "./machineForm";

function WebApp() {
    const [machines, setMachine] = useState([
        {
            name: "Bench",
            muscle: "Forearms",
        },
    ]);

    function addOneMachine(machine: machineI) {
        setMachine([...machines, machine]);
    }

    function removeOneMachine(index: number) {
        const updated = machines.filter((_, i) => {
            return i !== index;
        });
        setMachine(updated);
    }

    return (
        <div className="container">
            <MachineTable
                machineData={machines}
                removeMachine={removeOneMachine}
            />
            <MachineForm handleSubmit={addOneMachine} />
        </div>
    );
}
export default WebApp;
