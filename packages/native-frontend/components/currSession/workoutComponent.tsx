import {View, Text, Pressable} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import {Set} from "@/types/set";
import {Machine} from "@/types/machine";

type Props = {
    workoutId: string;
    handleDelete: (workoutId: string) => void;
    sets: Set[];
    sessionId: string | undefined;
    onPress: () => void;
    machine: Machine | undefined;
};

export default function Workout({
    workoutId,
    handleDelete,
    sets,
    onPress,
    machine,
}: Props)
{
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
                        handleDelete(workoutId);
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
            <Pressable onPress={onPress}>
                <View className="p-4 bg-white shadow-sm border border-neutral-200">
                    <View className="mb-1">
                        <Text className="text-2xl font-bold text-gray-900">
                            {machine?.name}
                        </Text>
                        <Text className="text-base text-gray-600">
                            {sets.length} Sets
                        </Text>
                    </View>
                </View>
            </Pressable>
        </ReanimatedSwipeable>
    );
}

export function Empty()
{
    return (
        <View className="flex-1 items-center bg-white pt-16">
            <Text className="text-2xl text-gray-300 font-semibold">
                Tap + to select a workout
            </Text>
        </View>
    );
}
