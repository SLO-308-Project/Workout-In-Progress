import { useState } from "react";
import { AttributeValue } from "../types/attributeValue";

export default function SetComponent(props) {
    const listAttributeValues = props.set.attributeValues.map((attributeValue: AttributeValue) =>
        <li key={props.set._id}>
            {attributeValue.name}: 
            {attributeValue.value}
        </li>
    );

    return (
        <div className="setComponent">
            <p>Set {props.index}</p>
            <ul>{listAttributeValues}</ul>
        </div>
    )
}
