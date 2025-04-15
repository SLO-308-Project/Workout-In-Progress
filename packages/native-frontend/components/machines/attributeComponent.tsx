import {Unit} from "@/types/unit";
import {View, Pressable, Text} from "react-native";

type Props = {
    name: string;
    unit: Unit;
    handleDelete: (name: string) => void;
};

export default function Attribute({name, unit, handleDelete}: Props)
{
    return (
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-2 flex-row justify-between items-center">
            <View className="flex-1">
                <Text className="text-lg font-medium text-gray-900">
                    Name: {name}
                </Text>
                <Text className="text-base text-gray-600">Unit: {unit}</Text>
            </View>
            <Pressable
                onPress={() => handleDelete(name)}
                className="bg-red-50 border border-red-300 px-4 py-2 rounded-full active:opacity-75"
            >
                <Text className="text-red-600 font-semibold text-center">
                    -
                </Text>
            </Pressable>
        </View>
    );
}
