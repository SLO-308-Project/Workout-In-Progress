import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { AttributeValue } from '@/types/attributeValue';
import { Set } from '@/types/set';
import AttributeValueComponent from '@/components/currSession/attributeValue';


type Props = {
    set: Set;
    index: number;
}

export default function SetComponent({ set, index }: Props) {
    const [showAV, setShowAV] = useState(false);


    const listAttributeValues = set.attributeValues.map(
        (attributeValue: AttributeValue, idx: number) => (
            <AttributeValueComponent key={idx} name={attributeValue.name} value={attributeValue.value} />
        ),
    );

    return (
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-2">
            <Pressable
                onPress={() => setShowAV(!showAV)}
                className="flex-row justify-between items-center active:opacity-75"
            >
                <Text className="text-lg font-medium text-gray-900">
                    Set {index}
                </Text>
            </Pressable>
            {showAV && (
                <View className="mt-3">
                    {listAttributeValues}
                </View>
            )}
        </View>
    )

}
