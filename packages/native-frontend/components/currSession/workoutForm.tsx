import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { Picker } from "@react-native-picker/picker";

import { Machine } from '@/types/machine';

type Props = {
    machineOptions: Machine[];
    handleSubmit: (machineId: string) => void;
}

export default function WorkoutForm({ machineOptions, handleSubmit }: Props) {
    const [selectedMachineId, setSelectedMachineId] = useState("");

    function submitWorkout() {
        // handles default case
        if (selectedMachineId === "") {
            handleSubmit(machineOptions[0]._id);
        }
        else {
            console.log(`passing: ${selectedMachineId}`)
            handleSubmit(selectedMachineId);
        }
    }

    const listMachineOptions = machineOptions.map((machine: Machine, idx: number) => (
        <Picker.Item key={idx} label={machine.name} value={machine._id} />
    ))


    return (
        <View>
            <Text>Select one of your Machines:</Text>
            <Picker 
                selectedValue={selectedMachineId}
                onValueChange={(value: string) => setSelectedMachineId(value)}>
                {listMachineOptions}
            </Picker>
            <Pressable className="bg-orange-600 px-6 py-3 rounded-xl" onPress={submitWorkout}>
                <Text className="">Add Workout</Text>
            </Pressable>
        </View>
    );
}
