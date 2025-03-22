import "../temp.css"
import {Unit} from "../types/unit";
import {Attribute} from "../types/attribute";
import {useState} from "react";

function AttributeForm(props)
{
    // const [selectedAttributeUnit, setSelectedAttributeUnit] = useState("");
    const [attribute, setAttribute] = useState<Attribute>({
        name: "",
        unit: Unit["LBS"], // default is the first unit in the enum. which is lbs
    });

    const listAttributeEnum = Object.keys(Unit).map((opt: string) => (
        <option value={opt}>{Unit[opt]}</option>
    ));

    function handleUnitChange(unit: Unit)
    {
        setAttribute({
            ...attribute,
            unit: Unit[unit],
        });
    }

    function handleNameChange(name: string)
    {
        setAttribute({
            ...attribute,
            name: name,
        });
    }

    function handleAddAttribute(): void
    {
        props.handleAddAttribute(attribute);
    }

    return (
        <div className="component attributeForm">
            <label>
                Attribute Name:
                <input
                    onChange={(event) => handleNameChange(event.target.value)}
                />
            </label>
            <label>
                Unit:
                <select
                    onChange={(event) => handleUnitChange(event.target.value)}
                >
                    {listAttributeEnum}
                </select>
            </label>
            <input
                type="button"
                value="Add Attribute"
                onClick={handleAddAttribute}
            />
        </div>
    );
}

export default AttributeForm;
