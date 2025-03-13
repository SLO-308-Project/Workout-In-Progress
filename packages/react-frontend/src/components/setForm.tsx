import { useState, useEffect } from "react";
import { Attribute } from "../types/attribute";
import { AttributeValue } from "../types/attributeValue";
import { fetchGetAttributes } from "../fetchers/machineFetchers";

export default function SetForm(props) {
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);

    useEffect(() => {
        getAttributes();
    }, [props.machineId])

    useEffect(() => {
        populateAttributeValues()
    }, [attributes])

    function getAttributes(): void {
        fetchGetAttributes(props.machineId)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then((res_data) => {
                setAttributes(res_data);
            }
            )
            .catch((err) => {
                console.log(err);
            });
    }

    // HACK: populating attribute values with placeholders on render. so that handleAttributeValueChange can find an attributeValue in its filter.
    function populateAttributeValues(): void {
        setAttributeValues(() => {
            return attributes.map(attr => ({ name: attr.name, value: -1 }))
        });
    }

    function handleAttributeValueChange(name: string, value: number) {

        // finding what attribute we're modifying
        const releventAttr = attributeValues.filter((av) => av.name === name)[0]
        releventAttr.value = value;

        setAttributeValues([...attributeValues.filter((av: AttributeValue) => av.name !== name), releventAttr]);
    }

    function handleSubmit(): void {
        console.log(`ATTRIBUTE VALUES ON SUBMIT: ${JSON.stringify(attributeValues)}`);
        props.handleSubmit(attributeValues);
    }

    const listAttributeValueBoxes = attributes.map((attribute: Attribute) => (
        <li key={attribute.name}>
            <input placeholder={attribute.name} onChange={(event) => handleAttributeValueChange(attribute.name, event.target.value)} />{attribute.unit}
        </li>
    ))

    return (
        <div className="setForm">
            <ul>{listAttributeValueBoxes}</ul>
            <input type="button" value="✓" onClick={handleSubmit} />
        </div>
    )

}
