import {Unit} from "@/types/unit";
import {View, Pressable, Text} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
    name: string;
    unit: Unit;
    handleDelete: (name: string) => void;
};

export default function Attribute({name, unit, handleDelete}: Props)
{
    return (
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-2 flex-row justify-between items-center">
            <View className="flex-row">
                <Text className="text-lg font-medium text-gray-900">
                    {name}
                </Text>
                <Text className="pl-2 text-lg text-gray-600 italic">
                    ({unit})
                </Text>
            </View>
            <Pressable
                onPress={() => handleDelete(name)}
                className="p-2 rounded-full active:scale-90"
            >
                <AntDesign name="minuscircle" size={24} color="#FF3B30" />
            </Pressable>
        </View>
    );
}

export function Empty()
{
    return (
        <View className="flex-1 items-center bg-white">
            <Text className="text-gray-300 font-semibold">
                You must have at least 1 attribute.
            </Text>
        </View>
    );
}
