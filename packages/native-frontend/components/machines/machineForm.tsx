import { useState } from "react";
import AttributeForm from "./attributeForm";
import AttributeComponent from "./attributeComponent";
import { Attribute } from "@/types/attribute";
import { Machine } from "@/types/machine";

import { Alert, Text, Pressable, TextInput, View } from "react-native";

type Props = {
    handleSubmit: (machine: Machine) => void;
}

export default function MachineForm({ handleSubmit }: Props) {
    const [machine, setMachine] = useState<Machine>({
        _id: "",
        name: "",
        muscle: "",
        attributes: [],
    });

    function handleNameChange(name: string) {
        setMachine({
            ...machine,
            name: name,
        });
    }

    function handleMuscleChange(muscle: string) {
        setMachine({
            ...machine,
            muscle: muscle,
        });
    }

    function addAttribute(attribute: Attribute) {
        setMachine({
            ...machine,
            attributes: [...machine.attributes, attribute],
        });
    }

    function deleteAttribute(attributeName: string) {
        setMachine({
            ...machine,
            attributes: machine.attributes.filter(
                (attr) => attr.name !== attributeName,
            ),
        });
    }

    function submitForm() {
        console.log(`IN SUBMITFORM: ${JSON.stringify(machine.attributes)}`);
        console.log(`name: ${machine.name} muscle: ${machine.muscle}`);
        if (!machine.name || !machine.muscle) {
            Alert.alert("unfilled machien vals");
        }
        if (machine.attributes.length === 0) {
            Alert.alert("machine needs at least 1 attribute");
        }
        else handleSubmit(machine);
    }

    const listAttributes = machine.attributes ?
        machine.attributes.map((attribute: Attribute, index) => (
            <AttributeComponent
                key={index}
                name={attribute.name}
                unit={attribute.unit}
                handleDelete={deleteAttribute}
            />
        ))
        : (<></>
        );


    return (
        <View>
            <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 m-4">
                {/* Form Heading */}
                <Text className="text-center text-2xl font-bold text-gray-900 mb-4">
                    Add Machine
                </Text>

                {/* Machine Name Input */}
                <TextInput
                    className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-base mb-4"
                    value={machine.name}
                    placeholder="Name"
                    placeholderTextColor="#A0A0A0"
                    onChangeText={(text) => handleNameChange(text)}
                />

                {/* Muscle Group Input */}
                <TextInput
                    className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-base mb-4"
                    value={machine.muscle}
                    placeholder="Muscle"
                    placeholderTextColor="#A0A0A0"
                    onChangeText={(text) => handleMuscleChange(text)}
                />

                {/* Attribute Form */}
                <AttributeForm handleAddAttribute={addAttribute} />

                {/* List of Attributes */}
                {listAttributes}

                {/* Submit Button */}
                <Pressable
                    className="bg-blue-600 px-6 py-3 rounded-xl active:opacity-75"
                    onPress={submitForm}
                >
                    <Text className="text-white text-center font-semibold">
                        Add Machine
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
