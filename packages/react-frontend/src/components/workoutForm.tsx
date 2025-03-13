import {useState, useEffect} from "react";

function WorkoutForm(props)
{
    const [machineOptions, setMachineOptions] = useState([]);
    const [selectedMachineId, setSelectedMachine] = useState("");

    // Gets the machines in the db and loads them into the options for the workout form
    useEffect(() =>
    {
        setMachineOptions(props.machineOptions);
    }, [props.machineOptions]);

    function submitWorkout()
    {
        console.log("TRYING TO SUBMIT A WORKOUT");
        // handles default case
        if (selectedMachineId === "")
        {
            props.handleSubmit(machineOptions[0]._id);
        }
        else
        {
            props.handleSubmit(selectedMachineId);
        }
    }

    return (
        <div>
            <label>Select one of your Machines:</label>
            <select
                onChange={(event) => setSelectedMachine(event.target.value)}
            >
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
