import { useState, useEffect } from "react";
import { fetchGetMachine } from "../fetchers/machineFetchers"

function WorkoutForm(props) {

    const [machineOptions, setMachineOptions] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState("");

    // Gets the machines in the db and loads them into the options for the workout form
    useEffect(() => {
        fetchGetMachine()
        .then((res: Response) => res.json())
        .then((json) => setMachineOptions(json))
        .catch((error: unknown) => console.log(error))
    }, []);

    return (
    <div>
            <label>Select one of your Machines:</label>
            <select onChange={(val)=> setSelectedMachine(val.target.value)}>
                {machineOptions.map((option) => (
                    <option key={option.name}>
                        {option.name}
                    </option>
                ))}
            </select>
    </div>
    );

}

export default WorkoutForm;
