import {Text, View, TextInput, Pressable} from "react-native";
import {useState, useEffect, useCallback} from "react";

import {Attribute} from "@/types/attribute";
import {AttributeValue} from "@/types/attributeValue";
import {fetchGetAttributes} from "@/fetchers/machineFetchers";

type Props = {
    machineId: string;
    handleSubmit: (attributeValues: AttributeValue[]) => void;
};

export default function SetForm({machineId, handleSubmit}: Props)
{
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [attributeValues, setAttributeValues] = useState<AttributeValue[]>(
        [],
    );

    const getAttributes = useCallback(() =>
    {
        fetchGetAttributes(machineId)
            .then((res) =>
            {
                if (res.ok)
                {
                    return res.json();
                }
            })
            .then((res_data) =>
            {
                setAttributes(res_data);
            })
            .catch((err) =>
            {
                console.log(err);
            });
    }, [machineId]);

    // HACK: populating attribute values with placeholders on render. so that handleAttributeValueChange can find an attributeValue in its filter.
    const populateAttributeValues = useCallback(() =>
    {
        setAttributeValues(() =>
        {
            return attributes.map((attr) => ({name: attr.name, value: -1}));
        });
    }, [attributes]);

    useEffect(() =>
    {
        getAttributes();
    }, [getAttributes]);

    useEffect(() =>
    {
        populateAttributeValues();
    }, [populateAttributeValues]);

    function handleAttributeValueChange(name: string, value: string)
    {
        const nvalue = Number(value);
        if (isNaN(nvalue))
        {
            console.log("Not a number attribute values attempted.");
            return;
        }
        // finding what attribute we're modifying
        const releventAttr = attributeValues.filter(
            (av) => av.name === name,
        )[0];
        releventAttr.value = nvalue;

        setAttributeValues([
            ...attributeValues.filter((av: AttributeValue) => av.name !== name),
            releventAttr,
        ]);
    }

    const listAttributeValueBoxes = attributes.map(
        (attribute: Attribute, idx: number) => (
            <View key={idx} className="flex-row">
                <TextInput
                    maxLength={5}
                    placeholder={attribute.name}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                        handleAttributeValueChange(attribute.name, value)
                    }
                />
                <Text className="px-4">{attribute.unit}</Text>
            </View>
        ),
    );

    return (
        <View>
            {listAttributeValueBoxes}
            <View className="items-center">
                <Pressable
                    className="bg-green-50 rounded-full px-4 py-2"
                    onPress={() => handleSubmit(attributeValues)}
                >
                    <Text className="text-lg text-green-600">+</Text>
                </Pressable>
            </View>
        </View>
    );
}
