// src/app.tsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MachineTable from "../components/machineTable";
import MachineForm from "../components/machineForm";
import MachineComponent from "../components/machineComponent";
import {
    fetchGetMachine,
    fetchPostMachine,
    fetchDeleteMachine,
} from "../fetchers/machineFetchers";

import { Machine } from "../types/machine";

function MachinePage() {
    const [machines, setMachine] = useState<Machine[]>([]);

    useEffect(() => {
        getMachines();
    }, []);

    function getMachines(): void {
        fetchGetMachine()
            .then((res: Response) => res.json())
            .then((res_data) => {
                console.log(`GETMACHINES RES_DATA=${res_data}`);
                setMachine(res_data);
            })
            .catch((error: unknown) => console.log(error));
    }

    function addOneMachine(machine: Machine): void {
        console.log(`${machine.name} ${machine.muscle}`);
        fetchPostMachine(machine)
            .then((res) => {
                if (res.status == 201) {
                    return res.json();
                }
            })
            .then((res_data) => {
                console.log(`RES_DATA=${JSON.stringify(res_data)}`)
                setMachine([...machines, res_data])
            })
            .catch((error: unknown) => {
                console.log(error);
            });
    }

    function removeOneMachine(name: string) {
        fetchDeleteMachine(name)
            .then((res) => {
                if (res.ok) {
                    setMachine(machines.filter((machine) => machine.name !== name));
                }
            })
            .catch((error: unknown) => {
                console.log(error);
            });
    }

    const listMachines = machines.map((machine: Machine) =>
        <li key={machine._id}>
            <MachineComponent machine={machine} handleDelete={removeOneMachine} />
        </li>
    )

    //     <MachineTable
    // machineData={machines}
    // removeMachine={removeOneMachine}
    //     />
    return (
        <div className="container">
            <ul>{listMachines}</ul>

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
