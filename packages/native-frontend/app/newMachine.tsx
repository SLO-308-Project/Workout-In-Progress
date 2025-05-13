import { useState, useLayoutEffect } from "react";
import { useNavigation, useRouter } from 'expo-router';
import AttributeForm from "@/components/machines/attributeForm";
import AttributeComponent from "@/components/machines/attributeComponent";
import { Attribute } from "@/types/attribute";
import { Machine } from "@/types/machine";
import {
    fetchPostMachine,
} from "@/fetchers/machineFetchers";

import { Alert, Text, Pressable, TextInput, View, Button } from "react-native";

export default function MachineForm() {
    const [machine, setMachine] = useState<Machine>({
        _id: "",
        name: "",
        muscle: "",
        attributes: [],
    });
    const navigation = useNavigation();
    const router = useRouter();

    function addOneMachine(machine: Machine): void {
        console.log(`${machine.name} ${machine.muscle}`);
        fetchPostMachine(machine)
            .then((res) => {
                if (res.status === 201) {
                    return res.json();
                }
            })
            .then((res_data) => {
                console.log(`RES_DATA=${JSON.stringify(res_data)}`);
            })
            .catch((error: unknown) => {
                console.log(error);
            });
    }

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
            Alert.alert("Missing name or muscle.");
        }
        if (machine.attributes.length === 0) {
            Alert.alert("At least 1 attribute required.");
        }
        else {
            addOneMachine(machine);
            router.back();
        }

    }

    const listAttributes = machine.attributes ? (
        machine.attributes.map((attribute: Attribute, index) => (
            <AttributeComponent
                key={index}
                name={attribute.name}
                unit={attribute.unit}
                handleDelete={deleteAttribute}
            />
        ))
    ) : (
        <></>
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Save"
                    onPress={submitForm}
                />
            ),
        });
    }, [navigation, submitForm]);

    return (
        <View className="pt-4 pl-4">
            <TextInput
                className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                value={machine.name}
                onChangeText={(text) => handleNameChange(text)}
                placeholder="Name"
                placeholderTextColor="#9CA3AF" // lighter muted gray
                textAlignVertical="center"
                style={{ lineHeight: 32, fontSize: 28 }}
                autoCapitalize="none"
            />
            <TextInput
                className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                value={machine.muscle}
                onChangeText={(text) => handleMuscleChange(text)}
                placeholder="Muscle"
                placeholderTextColor="#9CA3AF" // lighter muted gray
                textAlignVertical="center"
                style={{ lineHeight: 16 }}
                autoCapitalize="none"
            />

            <AttributeForm handleAddAttribute={addAttribute} />
            {listAttributes}
        </View>
    );
}
