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

import AttributeValueComponent from "@/components/currSession/attributeValue";

type Props = {
    set: Set;
    index: number;
    handleDelete: (workoutId: string, setId: string) => void;
    workoutId: string | undefined;
};

export default function SetComponent({
    set,
    index,
    workoutId,
    handleDelete,
}: Props)
{
    const [showAV, setShowAV] = useState(false);

    const listAttributeValues = set.attributeValues.map(
        (attributeValue: AttributeValue, idx: number) => (
            <AttributeValueComponent
                key={idx}
                name={attributeValue.name}
                value={attributeValue.value}
            />
        ),
    );

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
            friction={2}
            rightThreshold={20}
            renderRightActions={RightSwipeDelete}
            overshootFriction={8}
        >
            <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-2">
                <Pressable onPress={() => setShowAV(!showAV)}>
                    <View className="flex-row justify-between">
                        <Text className="text-lg font-medium text-gray-900">
                            Set {index}
                        </Text>
                    </View>
                    {showAV && (
                        <View className="mt-3">{listAttributeValues}</View>
                    )}
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
