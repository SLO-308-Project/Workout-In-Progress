import {Template} from "@/types/template";
import {Feather} from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import {View, Text, Pressable} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import * as Clipboard from "expo-clipboard";

type Props = {
    template: Template;
    handleDelete: (_id: string) => void;
};

export default function MachineComponent({template, handleDelete}: Props)
{
    function copyTemplateToClipboard()
    {
        Clipboard.setStringAsync(template._id);
        console.log(template.name);
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
                        handleDelete(template._id);
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
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-2xl font-bold text-gray-900">
                        {template.name}
                    </Text>
                    <Pressable
                        onPress={() =>
                        {
                            copyTemplateToClipboard();
                        }}
                    >
                        <Feather name="copy" size={34}></Feather>
                    </Pressable>
                </View>
            </View>
        </ReanimatedSwipeable>
    );
}

export function Empty()
{
    return (
        <View className="flex-1 items-center bg-white pt-16">
            <Text className="text-2xl text-gray-300 font-semibold">
                No Templates Found
            </Text>
        </View>
    );
}
