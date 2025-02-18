// src/app.tsx
import {useState, useEffect} from "react";
import {machineI} from "./machine";
import MachineTable from "./machineTable";
import MachineForm from "./machineForm";
import {
    fetchGetMachine,
    fetchPostMachine,
    fetchDeleteMachine,
} from "./services/machineServices";

function WebApp()
{
    const [machines, setMachine] = useState([
        {
            name: "Bench",
            muscle: "Forearms",
        },
    ]);
    function reloadUsers(): void
    {
        fetchGetMachine()
            .then((res: Response) => res.json())
            .then((json) => setMachine(json))
            .catch((error: unknown) => console.log(error));
    }

    useEffect(() =>
    {
        reloadUsers();
    }, []);

    function addOneMachine(machine: machineI): void
    {
        console.log(`${machine.name} ${machine.muscle}`);
        fetchPostMachine(machine.name, machine.muscle)
            .then((res) =>
            {
                if (res.status == 201)
                {
                    reloadUsers();
                }
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
    }

    // deletes locally, but not on the database... yet
    function removeOneMachine(index: number)
    {
        const updated = machines.filter((_, i) =>
        {
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
