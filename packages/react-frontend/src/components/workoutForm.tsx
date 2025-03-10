import { useState, useEffect } from "react";
import { fetchGetMachine } from "../fetchers/machineFetchers"

function WorkoutForm(props) {

    const [machineOptions, setMachineOptions] = useState([]);
    const [selectedMachineId, setSelectedMachine] = useState("");

    // Gets the machines in the db and loads them into the options for the workout form
    useEffect(() => {
        fetchGetMachine()
        .then((res: Response) => res.json())
        .then((json) => {
                setMachineOptions(json);
                setSelectedMachine(json[0]._id); // sets the initial machine to be the first one in the machine list
            })
        .catch((error: unknown) => console.log(error))
    }, []);


    function submitWorkout() {
        console.log("TRYING TO SUBMIT A WORKOUT");
        props.handleSubmit(selectedMachineId);
    }

    return (
    <div>
            <label>Select one of your Machines:</label>
            <select onChange={(event)=> setSelectedMachine(event.target.value)}>
                {machineOptions.map((option) => (
                    <option key={option.name} value={option._id}>
                        {option.name}
                    </option>
                ))}
            </select>
            <input type="button" value="Add Workout" onClick={submitWorkout} />
    </div>
    );

}

export default WorkoutForm;
