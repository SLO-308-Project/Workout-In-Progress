import {FlatList, View, Text} from "react-native";
import {Set} from "@/types/set";
import {Machine} from "@/types/machine";

type Props = {
    machine: Machine | undefined;
    set: Set;
    index: number;
};

export default function DisplaySet({machine, set, index}: Props)
{
    return (
        <View className="bg-gray-300 border border-gray-400 rounded-lg shadow-sm p-2 m-1 justify-center">
            <Text className="border-b border-gray-400 text-xl font-bold">
                Set{" " + (index + 1)}
            </Text>
            <FlatList
                data={set.attributeValues}
                renderItem={({item, index}) => (
                    <View className="pl-2">
                        <Text className="text-xl">
                            {item.name +
                                ": " +
                                (item.value ?? "<value>") +
                                " " +
                                machine?.attributes[index].unit}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
