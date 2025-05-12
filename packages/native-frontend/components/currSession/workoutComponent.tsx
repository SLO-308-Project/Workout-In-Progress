import {useState} from "react";
import {View, Text, Pressable} from "react-native";
import {Set} from "@/types/set";
import {AttributeValue} from "@/types/attributeValue";
import SetComponent from "@/components/currSession/setComponent";
import SetForm from "@/components/currSession/setForm";
import {fetchDeleteSet, fetchPostSet} from "@/fetchers/workoutFetchers";

type Props = {
    machineName: string | undefined;
    machineId: string;
    workoutId: string;
    handleDelete: (workoutId: string) => void;
    sets: Set[];
    sessionId: string | undefined;
};

export default function Workout({
    machineName,
    machineId,
    workoutId,
    handleDelete,
    sets,
    sessionId,
}: Props)
{
    const [showSets, setShowSets] = useState(false);
    const [allSets, setSets] = useState<Set[]>(sets);

    function addSet(attributeValues: AttributeValue[])
    {
        if (!sessionId)
        {
            throw new Error("Can't find a session to add set to.");
        }

        for (const attributeValue of attributeValues)
        {
            if (attributeValue.value === -1)
            {
                console.log("Attempted to add set with missing value(s)");
                return;
            }
        }
        console.log(`attributeValues=${attributeValues}`);
        fetchPostSet(sessionId, workoutId, attributeValues)
            .then((res) =>
            {
                if (res.ok)
                {
                    return res.text();
                }
            })
            .then((dbSetId) =>
            {
                if (!dbSetId)
                {
                    throw new Error(
                        "Database successfully updated but didnt return set id.",
                    );
                }
                const newSet: Set = {
                    _id: dbSetId,
                    attributeValues: attributeValues,
                };
                setSets([...allSets, newSet]);
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
    }

    function deleteSet(_id: string)
    {
        if (!sessionId)
        {
            throw new Error("Can't find a session to delete set.");
        }

        fetchDeleteSet(sessionId, workoutId, _id)
            .then((res) =>
            {
                if (res.ok)
                {
                    setSets(allSets.filter((set) => set._id !== _id));
                }
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
        // console.log(`deleteSet: _id=${_id} set._id=`)
        // allSets.map((set) => console.log(set._id));
    }

    const setList = () =>
        allSets.map((set: Set, index) => (
            <SetComponent
                key={set._id}
                set={set}
                index={index + 1}
                handleDelete={deleteSet}
            />
        ));

    return (
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-4">
            <Pressable
                onPress={() => setShowSets(!showSets)}
                className="flex-row justify-between items-center active:opacity-75"
            >
                <Text className="text-xl font-semibold text-gray-900">
                    {machineName}
                </Text>
                <Pressable
                    onPress={(event) =>
                    {
                        event.stopPropagation();
                        handleDelete(workoutId);
                    }}
                    className="bg-red-50 px-3 py-1 rounded-full"
                >
                    <Text className="text-sm text-red-600">Delete</Text>
                </Pressable>
            </Pressable>

            {showSets && (
                <View className="mt-4">
                    {setList()}
                    <SetForm handleSubmit={addSet} machineId={machineId} />
                </View>
            )}
        </View>
    );
}
