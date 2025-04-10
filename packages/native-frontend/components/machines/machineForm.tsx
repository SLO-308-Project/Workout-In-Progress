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
            <Text className="text-center">Add Machine</Text>
            <TextInput className="w-full bg-white px-4 py-3 border border-gray-300 rounded-xl text-base mb-4" value={machine.name} placeholder="name" onChangeText={(text) => handleNameChange(text)} />
            <TextInput className="w-full bg-white px-4 py-3 border border-gray-300 rounded-xl text-base mb-4" value={machine.muscle} placeholder="muscle" onChangeText={(text) => handleMuscleChange(text)} />
            <AttributeForm handleAddAttribute={addAttribute} />
            {listAttributes}
            <Pressable className="bg-blue-600 px-6 py-3 rounded-xl" onPress={submitForm}><Text>Add Machine</Text></Pressable>
        </View>
    );
}
