// src/Form.jsx
import "../temp.css"
import {useState} from "react";
import AttributeForm from "../components/attributeForm";
import AttributeComponent from "../components/attributeComponent";
import {Attribute} from "../types/attribute";
import {Machine} from "../types/machine";

function MachineForm(props)
{
    const [machine, setMachine] = useState<Machine>({
        _id: "",
        name: "",
        muscle: "",
        attributes: [],
    });

    function handleNameChange(name: string)
    {
        setMachine({
            ...machine,
            name: name,
        });
    }

    function handleMuscleChange(muscle: string)
    {
        setMachine({
            ...machine,
            muscle: muscle,
        });
    }

    function addAttribute(attribute: Attribute)
    {
        setMachine({
            ...machine,
            attributes: [...machine.attributes, attribute],
        });
    }

    function deleteAttribute(attribute: Attribute)
    {
        setMachine({
            ...machine,
            attributes: machine.attributes.filter(
                (attr) => attr.name === attribute.name,
            ),
        });
    }

    function submitForm()
    {
        console.log(`IN SUBMITFORM: ${JSON.stringify(machine.attributes)}`);
        console.log(`name: ${machine.name} muscle: ${machine.muscle}`);
        if (!machine.name || !machine.muscle)
        {
            alert("unfilled machien vals");
        }
        if (machine.attributes.length === 0)
        {
            alert("machine needs at least 1 attribute");
        }
        else props.handleSubmit(machine);
    }

    const listAttributes = machine.attributes ? (
        machine.attributes.map((attribute: Attribute) => (
            <li key={attribute.name}>
                <AttributeComponent
                    name={attribute.name}
                    unit={attribute.unit}
                    handleDelete={deleteAttribute}
                />
            </li>
        ))
    ) : (
        <></>
    );

    return (
        <div className="component">
            <label style={{fontSize: "24px", fontWeight: "bold"}}>
                Add Machine
            </label>
            <form>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    onChange={(event) => handleNameChange(event.target.value)}
                />
                <label htmlFor="muscle">Muscle</label>
                <input
                    type="text"
                    onChange={(event) => handleMuscleChange(event.target.value)}
                />
                <AttributeForm handleAddAttribute={addAttribute} />
                <ul>{listAttributes}</ul>
                <input type="button" value="Add Machine" onClick={submitForm} />
            </form>
        </div>
    );
}

export default MachineForm;
