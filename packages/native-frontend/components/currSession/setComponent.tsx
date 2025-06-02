import {View, Text, Pressable} from "react-native";
import {useState} from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import {AttributeValue} from "@/types/attributeValue";
import {Set} from "@/types/set";
import {Attribute} from "@/types/attribute";

import {fetchPatchSet} from "@/fetchers/workoutFetchers";

import AttributeValueComponent from "@/components/currSession/attributeValue";

type Props = {
    set: Set;
    index: number;
    handleDelete: (workoutId: string, setId: string) => void;
    workoutId: string | undefined;
    attributes: Attribute[] | undefined;
};

export default function SetComponent({
    set,
    index,
    workoutId,
    handleDelete,
    attributes,
}: Props)
{
    const [showAV, setShowAV] = useState(false);

    const listAttributeValues = set.attributeValues.map(
        (attributeValue: AttributeValue, idx: number) => (
            <AttributeValueComponent
                key={idx}
                name={attributeValue.name}
                value={attributeValue.value}
                unit={attrNameToUnit(attributeValue.name)}
                handleValueChange={changeAttributeValue}
            />
        ),
    );

    function changeAttributeValue(name: string, newValue: number)
    {
        const newAttributeValues: AttributeValue[] = set.attributeValues.map(
            (attributeValue) =>
                attributeValue.name === name
                    ? {
                          ...attributeValue,
                          value: newValue,
                      }
                    : attributeValue,
        );

        if (!workoutId)
        {
            throw new Error("Workout ID NULL or undefined when updating set");
        }
        fetchPatchSet(workoutId, set._id, newAttributeValues)
            .then((res) =>
            {
                if (res.ok)
                {
                    set.attributeValues = newAttributeValues;
                }
            })
            .catch((err: unknown) =>
            {
                console.log("Error updating set: ", err);
            });
    }

    // Helper function to get the unit for an attribute
    // Realistically, a unit should have been stored with each attribute value
    // Instead, we match against the machines attributes
    function attrNameToUnit(name: string)
    {
        const attr: Attribute | undefined = attributes?.filter(
            (attribute) => attribute.name === name,
        )[0];
        return attr?.unit;
    }

    function RightSwipeDelete(
        prog: SharedValue<number>,
        drag: SharedValue<number>,
        swipeableMethods: {
            openLeft: () => void;
            openRight: () => void;
            close: () => void;
        },
    )
    {
        const styleAnimation = useAnimatedStyle(() =>
        {
            return {
                transform: [{translateX: drag.value + 140}],
            };
        });

        return (
            <Reanimated.View style={styleAnimation}>
                <Pressable
                    onPress={() =>
                    {
                        swipeableMethods.close();
                        if (workoutId)
                        {
                            handleDelete(workoutId, set._id);
                        }
                        else
                        {
                            console.log("Failed to delete workoutId");
                        }
                    }}
                    className="bg-red-500 w-40 h-full flex items-center justify-center"
                >
                    <EvilIcons name="trash" size={36} color="white" />
                </Pressable>
            </Reanimated.View>
        );
    }

    // Set # starts from 1 instead of 0
    index = index + 1;
    return (
        <ReanimatedSwipeable
            friction={4}
            rightThreshold={20}
            renderRightActions={RightSwipeDelete}
            overshootFriction={8}
        >
            <View className="p-4 bg-gray-100 shadow-sm border border-neutral-200">
                <Pressable onPress={() => setShowAV(!showAV)}>
                    <Text className="text-lg font-semibold font-medium text-gray-900 pb-4">
                        Set {index}
                    </Text>
                    <View className="flex-row gap-x-12">
                        {listAttributeValues}
                    </View>
                </Pressable>
            </View>
        </ReanimatedSwipeable>
    );
}

export function Empty()
{
    return (
        <View className="flex-1 items-center pt-16">
            <Text className="text-2xl text-gray-300 font-semibold">
                Tap + to add a set
            </Text>
        </View>
    );
}
