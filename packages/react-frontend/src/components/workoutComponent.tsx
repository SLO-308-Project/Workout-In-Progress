import {useState} from "react";
import {Set} from "../types/set";
import {AttributeValue} from "../types/attributeValue";
// import { fetchPostSet } "../fetchers/workoutFetchers"
import SetComponent from "./setComponent";
import SetForm from "./setForm";

// TODO: need to create endpoints for adding a set, removing a set, updating a set.

export default function Workout(props)
{
    const [showSets, setShowSets] = useState(false);
    const [sets, setSets] = useState<Set[]>([]);

    function addSet(attributeValues: AttributeValue[])
    {
        const newSet: Set = {
            _id: sets.length.toString(),
            attributeValues: attributeValues,
        };
        setSets([...sets, newSet]);
    }

    const setList = () =>
        sets.map((set: Set, index) => <SetComponent set={set} index={index} />);

    return (
        <div className="workout">
            <h2>{props.machineName}</h2>
            <button onClick={() => props.handleDelete(props.workoutId)}>
                Delete
            </button>
            <button onClick={() => setShowSets(!showSets)}>
                {showSets ? "Hide" : "Show"} Sets
            </button>
            {showSets && (
                <SetForm handleSubmit={addSet} machineId={props.machineId} />
            )}
            {showSets && setList()}
        </div>
    );
}
