// src/app.tsx
import {useState, useEffect} from "react";
import MachineTable from "../components/machineTable";
import MachineForm from "../components/machineForm";
import {Link} from "react-router-dom";
import {
    fetchGetMachine,
    fetchPostMachine,
    fetchDeleteMachine,
} from "../fetchers/machineFetchers";

function MachinePage()
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

    function addOneMachine(machine): void
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
    function removeOneMachine(name: string)
    {
        fetchDeleteMachine(name)
        .then((res) => 
        {
            if (res.ok) 
            {
                reloadUsers();
            }

        })
        .catch((error: unknown) => 
        {
            console.log(error);
        });
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
export default MachinePage;
