import {useState} from "react";
import {View, Text, Button, FlatList, TextInput, Alert} from "react-native";
import {BottomSheetView} from "@gorhom/bottom-sheet";

import {Set} from "@/types/set";
import {Workout} from "@/types/workout";
import {Machine} from "@/types/machine";
import {Attribute} from "@/types/attribute";
import {AttributeValue} from "@/types/attributeValue";

import SetComponent from "@/components/currSession/setComponent";

type Props = {
    workout: Workout | null;
    addSet: (workoutId: string, attributeValues: AttributeValue[]) => void;
    deleteSet: (workoutId: string, setId: string) => void;
    machine: Machine | undefined;
};

export default function WorkoutSlide({
    workout,
    addSet,
    deleteSet,
    machine,
}: Props)
{
    return (
        <BottomSheetView className="flex-1 pl-4 pr-4">
            <Text
                className="w-80 px-4 py-3 rounded-lg text-base font-bold text-black"
                style={{fontSize: 28}}
            >
                {machine?.name}
            </Text>
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
                {workout?.sets.length} Sets
            </Text>
            <FlatList
                data={workout?.sets}
                renderItem={({item, index}) => (
                    <SetComponent
                        set={item}
                        index={index}
                        handleDelete={deleteSet}
                        workoutId={workout?._id}
                    />
                )}
            />
        </BottomSheetView>
    );
}
