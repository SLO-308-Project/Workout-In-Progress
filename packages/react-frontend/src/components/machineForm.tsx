// src/Form.jsx
import {useState, ChangeEvent} from "react";

function MachineForm(props)
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
        <form className="block shadow-default bg-gray-400 p-2 rounded-xl">
            <div className="flex text-2xl">
                <label className="pr-1" htmlFor="name">
                    Name:
                </label>
                <input className="w-full"
                    type="text"
                    name="name"
                    id="name"
                    value={machine.name}
                    onChange={handleChange}
                />
            </div>
            <hr className=""></hr>
            <div className="flex justify-start text-2xl">
                <label className="pr-1" htmlFor="muscle">
                    Muscle:
                </label>
                <input
                    className="w-full"
                    type="text"
                    name="job"
                    id="job"
                    value={machine.muscle}
                    onChange={handleChange}
                />
            </div>
            <div className="flex justify-end">
                <input
                    className="shadow-default bg-gray-500 px-2 rounded-xl hover:opacity-70"
                    type="button"
                    value="Submit"
                    onClick={submitForm}
                />
            </div>
        </form>
    );
}

export default MachineForm;
