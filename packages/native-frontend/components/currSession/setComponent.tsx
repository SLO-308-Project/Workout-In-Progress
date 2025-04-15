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
        (attributeValue: AttributeValue) => (
            <AttributeValueComponent key={index} name={attributeValue.name} value={attributeValue.value} />
        ),
    );

    return (
        <View>
            <Pressable onPress={() => setShowAV(!showAV)}>
                <Text>Set {index}</Text>
                {showAV && listAttributeValues}
            </Pressable>
        </View>
    )

}
