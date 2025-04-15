import {useState, useEffect, useCallback} from "react";
import AttributeForm from "./attributeForm";
import AttributeComponent from "./attributeComponent";
import {
    fetchGetAttributes,
    fetchPostAttribute,
    fetchDeleteAttribute,
} from "../fetchers/machineFetchers";
import {Attribute} from "../types/attribute";

export default function Machine(props)
{
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    const getAttributes = useCallback(() =>
    {
        console.log(`MACHINE._id = ${props.machine._id}`);
        fetchGetAttributes(props.machine._id)
            .then((res) =>
            {
                if (res.ok)
                {
                    return res.json();
                }
            })
            .then((res_data) =>
            {
                console.log(`res_data.attributes = ${res_data.attributes}`);

                console.log(`${JSON.stringify(res_data)}`);
                setAttributes(res_data);
            })
            .catch((err) =>
            {
                console.log(err);
            });
    }, [props.machine]);

    useEffect(() =>
    {
        getAttributes();
    }, [getAttributes]);

    function deleteMachine(): void
    {
        props.handleDelete(props.machine.name);
    }

    function addAttribute(attribute: Attribute)
    {
        console.log(`NAME: ${attribute.name} UNIT: ${attribute.unit}`);
        fetchPostAttribute(props.machine._id, attribute)
            .then((res) =>
            {
                if (res.ok)
                {
                    return res.json();
                }
            })
            .then((res_data) => setAttributes(res_data.attributes))
            .catch((err) => console.log(err));
    }

    function deleteAttribute(attrName: string)
    {
        fetchDeleteAttribute(props.machine._id, attrName)
            .then((res) =>
            {
                if (res.ok)
                {
                    setAttributes(
                        attributes.filter(
                            (attribute) => attribute.name !== attrName,
                        ),
                    );
                }
            })
            .catch((err) => console.log(err));
    }

    const listAttributes = attributes ? (
        attributes.map((attribute: Attribute) => (
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
        <div className="machine">
            <h2>{props.machine.name}</h2>
            <h4>{props.machine.muscle}</h4>
            <button onClick={deleteMachine}>Delete {props.machine.name}</button>
            <ul>{listAttributes}</ul>
            <AttributeForm handleAddAttribute={addAttribute} />
        </div>
    );
}
