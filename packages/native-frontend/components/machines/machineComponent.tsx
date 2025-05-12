import { View, Text, Pressable } from "react-native";
import { useState, useEffect, useCallback } from "react";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

import AttributeForm from "./attributeForm";
import AttributeComponent from "./attributeComponent";
import {
    fetchGetAttributes,
    fetchPostAttribute,
    fetchDeleteAttribute,
} from "@/fetchers/machineFetchers";
import { Attribute } from "@/types/attribute";
import { Machine } from "@/types/machine";

type Props = {
    machine: Machine;
    handleDelete: (name: string) => void;
};

export default function MachineComponent({ machine, handleDelete }: Props) {
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    const getAttributes = useCallback(() => {
        console.log(`MACHINE._id = ${machine._id}`);
        fetchGetAttributes(machine._id)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((res_data) => {
                console.log(`res_data.attributes = ${res_data.attributes}`);

                console.log(`${JSON.stringify(res_data)}`);
                setAttributes(res_data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [machine]);

    useEffect(() => {
        getAttributes();
    }, [getAttributes]);

    function deleteMachine(): void {
        handleDelete(machine.name);
    }

    function addAttribute(attribute: Attribute) {
        console.log(`NAME: ${attribute.name} UNIT: ${attribute.unit}`);
        fetchPostAttribute(machine._id, attribute)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((res_data) => setAttributes(res_data.attributes))
            .catch((err) => console.log(err));
    }

    function deleteAttribute(attrName: string) {
        console.log(`DELETING ATTRIBUTE: ${attrName}`);
        fetchDeleteAttribute(machine._id, attrName)
            .then((res) => {
                if (res.ok) {
                    setAttributes(
                        attributes.filter(
                            (attribute) => attribute.name !== attrName,
                        ),
                    );
                }
            })
            .catch((err) => console.log(err));
    }

    const listAttributes = attributes ? (
        attributes.map((attribute: Attribute, index) => (
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

    // Displays a delete button when swiping right on a session
    function RightSwipeDelete(
        prog: SharedValue<number>,
        drag: SharedValue<number>,
        swipeableMethods: {
            openLeft: () => void;
            openRight: () => void;
            close: () => void;
        }) {
        const styleAnimation = useAnimatedStyle(() => {
            return {
                transform: [{ translateX: drag.value + 140 }],
            };
        });

        return (
            <Reanimated.View style={styleAnimation}>
                <Pressable
                    onPress={() => {
                        swipeableMethods.close();
                        deleteMachine();
                    }}
                    className="bg-red-500 w-40 h-full flex items-center justify-center"
                >
                    <EvilIcons name="trash" size={36} color="white" />
                </Pressable>
            </Reanimated.View>
        );
    }

    return (
        <ReanimatedSwipeable
            friction={2}
            rightThreshold={20}
            renderRightActions={RightSwipeDelete}
            overshootFriction={8}
        >
            <View className="p-4 bg-white shadow-sm border border-neutral-200">
                <View className="mb-1">
                    <Text className="text-2xl font-bold text-gray-900">
                        {machine.name}
                    </Text>
                    <Text className="text-base text-gray-600">
                        {machine.muscle}
                    </Text>
                </View>
            </View>
        </ReanimatedSwipeable>
    );
}
// <Pressable
//     onPress={deleteMachine}
//     className="bg-red-50 border border-red-300 px-4 py-2 rounded-full active:opacity-75 mb-4"
// >
//     <Text className="text-red-600 font-semibold text-center">
//         Delete {machine.name}
//     </Text>
// </Pressable>
//
// {/* Attribute list */}
// <View className="mb-4">{listAttributes}</View>
//
// {/* Attribute form */}
// <View>
//     <AttributeForm handleAddAttribute={addAttribute} />
// </View>
// Component to be rendered when machine list is empty
export function Empty() {
    return (
        <View className="flex-1 items-center bg-white">
            <Text className="text-2xl text-gray-300 font-semibold">
                No Machines Yet
            </Text>
        </View>
    )
}
