import {useState} from "react";
import {View, Text, Pressable} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import {AttributeValue} from "@/types/attributeValue";
import {Set} from "@/types/set";

import {fetchDeleteSet, fetchPostSet} from "@/fetchers/workoutFetchers";
import SetComponent from "@/components/currSession/setComponent";
import SetForm from "@/components/currSession/setForm";

type Props = {
    machineName: string | undefined;
    machineId: string;
    workoutId: string;
    handleDelete: (workoutId: string) => void;
    sets: Set[];
    sessionId: string | undefined;
    onPress: () => void;
};

export default function Workout({
    machineName,
    machineId,
    workoutId,
    handleDelete,
    sets,
    sessionId,
    onPress,
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
                            {machineName}
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
                Tap + to begin a workout
            </Text>
        </View>
    );
}
// <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-4">
//     <Pressable
//         onPress={() => setShowSets(!showSets)}
//         className="flex-row justify-between items-center active:opacity-75"
//     >
//         <Text className="text-xl font-semibold text-gray-900">
//             {machineName}
//         </Text>
//         <Pressable
//             onPress={(event) =>
//             {
//                 event.stopPropagation();
//                 handleDelete(workoutId);
//             }}
//             className="bg-red-50 px-3 py-1 rounded-full"
//         >
//             <Text className="text-sm text-red-600">Delete</Text>
//         </Pressable>
//     </Pressable>
//
//     {showSets && (
//         <View className="mt-4">
//             {setList()}
//             <SetForm handleSubmit={addSet} machineId={machineId} />
//         </View>
//     )}
// </View>
