import { View, Pressable, Text } from "react-native";

type Props = {
    name: string;
    unit: string;
    handleDelete: (name: string) => void;
}

export default function Attribute({ name, unit, handleDelete }: Props)
{
    function deleteAttribute(): void
    {
        handleDelete(name);
    }

    return (
        <View>
            <View>Name: {name}</View>
            <View>Unit: {unit}</View>
            <View>
                <Pressable onPress={deleteAttribute}>
                    <Text>-</Text>
                </Pressable>
            </View>
        </View>
    );
}
