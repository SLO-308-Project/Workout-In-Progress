// src/Form.jsx
import {useState, ChangeEvent} from "react";
import {machineFormProp} from "./machine";

function MachineForm(props: machineFormProp)
{
    const [machine, setMachine] = useState({
        name: "",
        muscle: "",
    });

    function handleChange(event: ChangeEvent<HTMLInputElement>)
    {
        const {name, value} = event.target;
        if (name === "name")
            setMachine({name: value, muscle: machine["muscle"]});
        else setMachine({name: machine["name"], muscle: value});
    }

    function submitForm()
    {
        props.handleSubmit(machine);
        setMachine({name: "", muscle: ""});
    }

    return (
        <form>
            <label htmlFor="name">Name</label>
            <input
                type="text"
                name="name"
                id="name"
                value={machine.name}
                onChange={handleChange}
            />
            <label htmlFor="muscle">Muscle</label>
            <input
                type="text"
                name="job"
                id="job"
                value={machine.muscle}
                onChange={handleChange}
            />
            <input type="button" value="Submit" onClick={submitForm} />
        </form>
    );
}

export default MachineForm;
