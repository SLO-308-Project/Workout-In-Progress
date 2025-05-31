import {View, Text, Pressable} from "react-native";
import {useState} from "react";
import {AttributeValue} from "@/types/attributeValue";
import {Set} from "@/types/set";
import AttributeValueComponent from "@/components/currSession/attributeValue";

type Props = {
    set: Set;
    index: number;
    handleDelete: (workoutId: string, setId: string) => void;
    workoutId: string | undefined;
};

export default function SetComponent({
    set,
    index,
    workoutId,
    handleDelete,
}: Props)
{
    const [showAV, setShowAV] = useState(false);

    const listAttributeValues = set.attributeValues.map(
        (attributeValue: AttributeValue, idx: number) => (
            <AttributeValueComponent
                key={idx}
                name={attributeValue.name}
                value={attributeValue.value}
            />
        ),
    );

    return (
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-2">
            <Pressable onPress={() => setShowAV(!showAV)}>
                <View className="flex-row justify-between">
                    <Text className="text-lg font-medium text-gray-900">
                        Set {index}
                    </Text>
                    <Pressable
                        onPress={(event) =>
                        {
                            event.stopPropagation();
                            if (workoutId)
                            {
                                handleDelete(workoutId, set._id);
                            }
                        }}
                        className="bg-red-50 px-3 py-1 rounded-full"
                    >
                        <Text className="text-sm text-red-600">Delete</Text>
                    </Pressable>
                </View>
                {showAV && <View className="mt-3">{listAttributeValues}</View>}
            </Pressable>
        </View>
    );
}
