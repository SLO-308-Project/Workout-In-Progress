import {Template} from "@/types/template";
import {View, Text, FlatList, Pressable} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import DisplayWorkout from "../sessions/displayWorkout";
import {Feather} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

type Props = {
    template: Template | null;
};

export default function TemplateSlide({template}: Props)
{
    function copyTemplateToClipboard()
    {
        Clipboard.setStringAsync(template ? template._id : "");
        console.log(template?.name);
    }

    return (
        <SafeAreaView>
            <View>
                <Text className="px-4 pt-3 rounded-xl text-2xl font-bold text-black">
                    {template?.name}
                </Text>
                <Pressable
                    className="flex-row items-center"
                    onPress={() =>
                    {
                        copyTemplateToClipboard();
                    }}
                >
                    <Text className="px-4 pt-1 text-xl">
                        TemplateId: {template?._id}
                    </Text>
                    <Feather name="copy" size={24}></Feather>
                </Pressable>
                {/* Render each Workout */}
                <View className="bg-gray-100 border border-gray-400 rounded-lg shadow-sm p-2 m-1 justify-center">
                    <Text className="text-xl font-bold">Machines:</Text>
                    <FlatList
                        data={template?.workout}
                        renderItem={({item, index}) => (
                            <DisplayWorkout
                                allMachines={template ? template.machines : []}
                                workout={item}
                            />
                        )}
                        ListEmptyComponent={
                            <Text className="text-2xl">Empty Session</Text>
                        }
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
