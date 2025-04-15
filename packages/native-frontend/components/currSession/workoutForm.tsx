import {View, Text, Pressable} from "react-native";
import {useState} from "react";
import {Picker} from "@react-native-picker/picker";

import {Machine} from "@/types/machine";

type Props = {
    machineOptions: Machine[];
    handleSubmit: (machineId: string) => void;
};

export default function WorkoutForm({machineOptions, handleSubmit}: Props)
{
    const [selectedMachineId, setSelectedMachineId] = useState("");

    function submitWorkout()
    {
        // handles default case
        if (selectedMachineId === "")
        {
            handleSubmit(machineOptions[0]._id);
        }
        else
        {
            console.log(`passing: ${selectedMachineId}`);
            handleSubmit(selectedMachineId);
        }
    }

    const listMachineOptions = machineOptions.map(
        (machine: Machine, idx: number) => (
            <Picker.Item
                key={idx}
                label={machine.name}
                value={machine._id}
                color="#000"
            />
        ),
    );

    return (
        <View>
            <Picker
                selectedValue={selectedMachineId}
                onValueChange={(value: string) => setSelectedMachineId(value)}
            >
                {listMachineOptions}
            </Picker>
            <Pressable
                className="bg-orange-100 px-6 py-3 rounded-full active:opacity-80 transition-all duration-200 items-center"
                onPress={submitWorkout}
            >
                <Text className="text-orange-600 text-base font-semibold">
                    Add Workout
                </Text>
            </Pressable>
        </View>
    );
}
