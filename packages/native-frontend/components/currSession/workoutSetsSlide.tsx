import {useState} from "react";
import {View, Text, Button, FlatList, TextInput, Alert} from "react-native";
import {BottomSheetView} from "@gorhom/bottom-sheet";

import {Set} from "@/types/set";
import {Workout} from "@/types/workout";
import {Machine} from "@/types/machine";
import {Attribute} from "@/types/attribute";
import {AttributeValue} from "@/types/attributeValue";

type Props = {
    currWorkout: Workout | null;
    addSet: (workoutId: string, attributeValues: AttributeValue[]) => void;
    deleteSet: (workoutId: string, setId: string) => void;
};

export default function WorkoutSlide({currWorkout}: Props)
{
    const [workout, setWorkout] = useState<Workout | null>(currWorkout);

    return (
        <BottomSheetView className="flex-1 pl-4 pr-4">
            <Text>
                This is the workout slide. It will allow a user to add sets,
                delete sets, and interact with sets.
            </Text>
            <Text>This is {workout?._id}</Text>
        </BottomSheetView>
    );
}
