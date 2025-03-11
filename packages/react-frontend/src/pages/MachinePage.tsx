// src/app.tsx
import { Link } from "react-router-dom";
import {useState, useEffect} from "react";
import MachineTable from "../components/machineTable";
import MachineForm from "../components/machineForm";
import {
    fetchGetMachine,
    fetchPostMachine,
    fetchDeleteMachine,
} from "../fetchers/machineFetchers";
import {Machine} from "../types/sessionTypes";

function MachinePage()
{
    const [machines, setMachine] = useState([]);

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

    function addOneMachine(machine): void
    {
        console.log(`${machine.name} ${machine.muscle}`);
        fetchPostMachine(machine.name, machine.muscle)
            .then((res) =>
            {
                if (res.status == 201)
                {
                    setMachine([...machines, machine]);
                }
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
    }

    // deletes locally, but not on the database... yet
    function removeOneMachine(name: string)
    {
        fetchDeleteMachine(name)
            .then((res) =>
            {
                if (res.ok)
                {
                    setMachine(machines.filter((machine) => machine.name !== name));
                }
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
    }

    return (
        <div className="container h-screen bg-gray-300 mx-auto px-4">
            <MachineTable
                machineData={machines}
                removeMachine={removeOneMachine}
            />
            <MachineForm handleSubmit={addOneMachine} />

            <Link to="/CurrentSession">
                <button variant="outlined">
                        Go to Current Session Page
                </button>
            </Link>
            <Link to="/Sessions">
                <button variant="outlined">
                        Go to Main Sessions Page
                </button>
            </Link>
        </div>
    );
}
export default MachinePage;
