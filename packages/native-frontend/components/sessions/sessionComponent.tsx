import {View, Text, Pressable} from "react-native";
import {Session} from "@/types/session";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
    name: string;
    date: string;
    duration: string;
    deleteSession: (id: string) => void;
    session: Session;
};

export default function SessionComponent({
    name,
    date,
    duration,
    deleteSession,
    session,
}: Props)
{
    // Displays a delete button when swiping right on a session
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
                        deleteSession(session._id);
                    }}
                    className="bg-red-500 w-40 h-full flex items-center justify-center"
                >
                    <EvilIcons name="trash" size={36} color="white" />
                </Pressable>
            </Reanimated.View>
        );
    }

    const getSetCount = session.workout.reduce((sum, workout) =>
    {
        return sum + workout.sets.length;
    }, 0);

    return (
        <ReanimatedSwipeable
            friction={2}
            rightThreshold={20}
            renderRightActions={RightSwipeDelete}
            overshootFriction={8}
        >
            <View className="p-4 bg-white shadow-sm border border-neutral-200">
                <View className="flex-row justify-between">
                    <Text className="text-lg font-semibold text-black mb-1">
                        {name}
                    </Text>
                    <Text className="text-sm text-neutral-700 mb-1">
                        {date}
                    </Text>
                </View>
                <Text className="text-sm text-neutral-700">{duration}</Text>
                <Text className="text-sm text-neutral-700">
                    {getSetCount} Sets
                </Text>
            </View>
        </ReanimatedSwipeable>
    );
}

// Component to be rendered when session list is empty
export function Empty()
{
    return (
        <View className="flex-1 items-center bg-white pt-16">
            <Text className="text-2xl text-gray-300 font-semibold">
                No Sessions Yet
            </Text>
        </View>
    );
}
