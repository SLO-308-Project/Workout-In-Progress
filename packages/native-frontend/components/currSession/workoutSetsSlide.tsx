import {useState} from "react";
import {
    Pressable,
    View,
    Text,
    Button,
    FlatList,
    TextInput,
    Alert,
} from "react-native";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";

import {Set} from "@/types/set";
import {Workout} from "@/types/workout";
import {Machine} from "@/types/machine";
import {AttributeValue} from "@/types/attributeValue";

import SetComponent, {Empty} from "@/components/currSession/setComponent";

type Props = {
    workout: Workout | null;
    addSet: (
        workoutId: string,
        attributeValues: AttributeValue[],
    ) => Promise<Set | undefined>;
    deleteSet: (
        workoutId: string,
        setId: string,
    ) => Promise<boolean | undefined>;
    machine: Machine | undefined;
};

export default function WorkoutSlide({
    workout,
    addSet,
    deleteSet,
    machine,
}: Props)
{
    const [sets, setSets] = useState<Set[]>(workout?.sets ?? []);

    const blankAttributeValues: AttributeValue[] =
        machine?.attributes.map((attribute) =>
        {
            return {
                name: attribute.name,
                value: 0,
            };
        }) ?? [];

    // Using promises so that current session page can update its workout sets and the slide can also update its own.
    function handleAddSet()
    {
        if (workout)
        {
            addSet(workout._id, blankAttributeValues).then((newSet) =>
            {
                if (newSet)
                {
                    setSets([...sets, newSet]);
                }
                else
                {
                    console.log("addSet returned undefined");
                }
            });
        }
    }

    function handleDeleteSet(setId: string)
    {
        if (workout)
        {
            deleteSet(workout._id, setId).then((success) =>
            {
                if (success)
                {
                    setSets(
                        sets.filter((set) =>
                        {
                            return set._id !== setId;
                        }),
                    );
                }
                else
                {
                    console.log("failed to delete set");
                }
            });
        }
    }

    return (
        <BottomSheetView className="flex-1 pl-4 pr-4">
            <View className="flex-row justify-between">
                <Text
                    className="w-80 px-4 py-3 rounded-lg text-base font-bold text-black"
                    style={{fontSize: 28}}
                >
                    {machine?.name}
                </Text>
                <Pressable
                    className="active:opacity-60 transition-all duration-200"
                    onPress={() => handleAddSet()}
                >
                    <AntDesign name="plus" size={32} color="black" />
                </Pressable>
            </View>
            <Text
                className="w-40 px-4 rounded-lg text-base text-black"
                style={{fontSize: 16}}
            >
                {machine?.muscle}
            </Text>
            <Text
                className="w-40 px-4 rounded-lg text-base text-black italic"
                style={{fontSize: 16}}
            >
                {sets.length} Sets
            </Text>
            <FlatList
                data={sets}
                renderItem={({item, index}) => (
                    <SetComponent
                        set={item}
                        index={index}
                        handleDelete={() => handleDeleteSet(item._id)}
                        workoutId={workout?._id}
                    />
                )}
                ListEmptyComponent={<Empty />}
            />
        </BottomSheetView>
    );
}
