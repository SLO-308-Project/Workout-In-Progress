import "../temp.css"
import {useState} from "react";
import {AttributeValue} from "../types/attributeValue";

export default function SetComponent(props)
{
    const listAttributeValues = props.set.attributeValues.map(
        (attributeValue: AttributeValue) => (
            <li key={props.set._id}>
                {attributeValue.name}:{attributeValue.value}
            </li>
        ),
    );

    return (
        <div className="setComponent component">
            <p>Set {props.index + 1}</p>
            <ul>{listAttributeValues}</ul>
        </div>
    );
}
