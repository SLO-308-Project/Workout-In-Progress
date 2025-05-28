import {View, Text, Pressable} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import {Machine} from "@/types/machine";

type Props = {
    machine: Machine;
    handleDelete: (name: string) => void;
    onPress: () => void;
};

export default function MachineComponent({
    machine,
    handleDelete,
    onPress,
}: Props)
{
    function deleteMachine(): void
    {
        handleDelete(machine.name);
    }

    // Displays a delete button when swiping right on a machine
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
        <Pressable onPress={onPress}>
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
        </Pressable>
    );
}

// Component to be rendered when machine list is empty
export function Empty()
{
    return (
        <View className="flex-1 items-center bg-white pt-16">
            <Text className="text-2xl text-gray-300 font-semibold">
                No Machines Found
            </Text>
        </View>
    );
}
