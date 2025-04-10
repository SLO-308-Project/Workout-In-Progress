import { Unit } from "@/types/unit";
import { View, Pressable, Text } from "react-native";

type Props = {
    name: string;
    unit: Unit;
    handleDelete: (name: string) => void;
}

export default function Attribute({ name, unit, handleDelete }: Props) {
    // function deleteAttribute(): void {
    //     handleDelete(name);
    // }
    return (
        <View>
            <Text>Name: {name}</Text>
            <Text>Unit: {unit}</Text>
            <Pressable className="bg-blue-600 px-6 py-3 rounded-xl" onPress={() => handleDelete(name)}>
                <Text>-</Text>
            </Pressable>
        </View>
    );
}
