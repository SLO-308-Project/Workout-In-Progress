import {AntDesign} from "@expo/vector-icons";
import {useState} from "react";
import {Pressable, Text, View, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function TemplatesPage()
{
    const [templates, setTemplates] = useState<Template[]>([]);

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white pt-4">
            <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
                <Text className="text-3xl font-semibold text-black tracking-tight">
                    Templates
                </Text>
                <Pressable className="" onPress={() =>
                {}}>
                    <AntDesign name="plus" size={32} color="black" />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: "#FFF",
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    inputContainerStyle: {
        backgroundColor: "#F2F2F7",
        height: 35,
    },
    inputStyle: {
        color: "#000",
        fontSize: 16,
    },
});
