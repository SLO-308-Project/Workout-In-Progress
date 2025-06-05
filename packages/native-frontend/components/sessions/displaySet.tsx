import {FlatList, View, Text, Pressable} from "react-native";
import {Set} from "@/types/set";
import {Machine} from "@/types/machine";
import {useState} from "react";
import {AntDesign} from "@expo/vector-icons";

type Props = {
    machine: Machine | undefined;
    set: Set;
    index: number;
};

export default function DisplaySet({machine, set, index}: Props)
{
    const [visible, setVisible] = useState<Boolean>(false);

    return (
        <View className="bg-gray-300 border border-gray-400 rounded-lg shadow-sm p-2 m-1 justify-center">
            <Pressable
                className="flex-row border-b border-gray-400"
                onPress={() =>
                {
                    setVisible(visible ? false : true);
                }}
            >
                <Text className="text-xl pr-2 font-bold">
                    Set{" " + (index + 1)}
                </Text>
                {visible && <AntDesign name="down" size={24} color="black" />}
                {!visible && <AntDesign name="right" size={24} color="black" />}
            </Pressable>
            {visible && (
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
            )}
        </View>
    );
}
