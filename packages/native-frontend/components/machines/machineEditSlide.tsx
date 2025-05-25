import React, {useState} from "react";
import {View, Text, Button, FlatList, TextInput, Alert} from "react-native";
import {BottomSheetView} from "@gorhom/bottom-sheet";

import {Machine} from "@/types/machine";
import {Attribute} from "@/types/attribute";

import AttributeComponent, {
    Empty,
} from "@/components/machines/attributeComponent";
import AttributeForm from "@/components/machines/attributeForm";
import {fetchUpdateMachine} from "@/fetchers/machineFetchers";

type Props = {
    machine: Machine | null;
};

export default function MachineSlide({machine}: Props)
{
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editMachine, setEditMachine] = useState<Machine | null>(machine);

    async function updateMachine(machine: Machine)
    {
        console.log(`${machine.name} ${machine.muscle}`);
        return fetchUpdateMachine(
            machine.name,
            editMachine?.name,
            editMachine?.muscle,
        )
            .then((res) =>
            {
                if (res.status === 201)
                {
                    return res.json();
                }
            })
            .then((res_data) =>
            {
                console.log(`RES_DATA=${JSON.stringify(res_data)}`);
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
    }

    function handleNameChange(name: string)
    {
        if (editMachine)
        {
            setEditMachine({
                ...editMachine,
                name: name,
            });
        }
    }

    function handleMuscleChange(muscle: string)
    {
        if (editMachine)
        {
            setEditMachine({
                ...editMachine,
                muscle: muscle,
            });
        }
    }

    function addAttribute(attribute: Attribute)
    {
        if (editMachine)
        {
            setEditMachine({
                ...editMachine,
                attributes: [...editMachine?.attributes, attribute],
            });
        }
    }

    function deleteAttribute(attributeName: string)
    {
        if (editMachine)
        {
            setEditMachine({
                ...editMachine,
                attributes: editMachine.attributes.filter(
                    (attr) => attr.name !== attributeName,
                ),
            });
        }
    }

    async function handleSavePress()
    {
        if (!editMachine?.name || !editMachine?.muscle)
        {
            Alert.alert("Missing name or muscle.");
        }
        else if (editMachine?.attributes.length === 0)
        {
            Alert.alert("At least 1 attribute required.");
        }
        else
        {
            await updateMachine(editMachine);
            setEditMode(false);
        }
    }

    const handleEditPress = () =>
    {
        setEditMode(true);
    };

    return (
        <BottomSheetView className="flex-1 pl-4 pr-4">
            {/* Shows just machine info if not in edit mode*/}
            {!editMode && (
                <>
                    <View className="flex-row justify-between">
                        <Text
                            className="w-80 px-4 py-3 rounded-lg text-base font-bold text-black"
                            style={{fontSize: 28}}
                        >
                            {machine?.name}
                        </Text>
                        <Button title="Edit" onPress={handleEditPress} />
                    </View>
                    <Text
                        className="w-40 px-4 rounded-lg text-base text-black mb-4"
                        style={{fontSize: 16}}
                    >
                        {machine?.muscle}
                    </Text>
                    <Text className="px-4 text-2xl font-semibold text-black tracking-tight pt-4">
                        Attributes
                    </Text>
                    <FlatList
                        data={machine?.attributes}
                        renderItem={({item, index}) => (
                            <AttributeComponent
                                key={index}
                                name={item.name}
                                unit={item.unit}
                            />
                        )}
                        ListEmptyComponent={<Empty />}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            )}

            {/*Otherwise, show edit mode*/}
            {editMode && (
                <>
                    <View className="flex-row justify-between">
                        <TextInput
                            className="w-80 font-bold bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                            value={machine?.name}
                            onChangeText={(text) => handleNameChange(text)}
                            placeholder="Name"
                            placeholderTextColor="#9CA3AF" // lighter muted gray
                            textAlignVertical="center"
                            style={{lineHeight: 32, fontSize: 28}}
                            autoCapitalize="none"
                        />
                        <Button title="Save" onPress={handleSavePress} />
                    </View>
                    <TextInput
                        className="w-40 bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                        value={machine?.muscle}
                        onChangeText={(text) => handleMuscleChange(text)}
                        placeholder="Muscle"
                        placeholderTextColor="#9CA3AF" // lighter muted gray
                        textAlignVertical="center"
                        style={{lineHeight: 16}}
                        autoCapitalize="none"
                    />
                    <Text className="px-4 text-2xl font-semibold text-black tracking-tight pt-4">
                        Attributes
                    </Text>
                    <FlatList
                        data={machine?.attributes}
                        renderItem={({item, index}) => (
                            <AttributeComponent
                                key={index}
                                name={item.name}
                                unit={item.unit}
                                handleDelete={deleteAttribute}
                            />
                        )}
                        ListEmptyComponent={<Empty />}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={
                            <AttributeForm handleAddAttribute={addAttribute} />
                        }
                    />
                </>
            )}
        </BottomSheetView>
    );
}
