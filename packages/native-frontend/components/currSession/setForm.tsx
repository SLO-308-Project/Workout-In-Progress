import {Text, View, TextInput, Pressable} from "react-native";
import {useState, useEffect} from "react";

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

    useEffect(() =>
    {
        getAttributes();
    }, [machineId]);

    useEffect(() =>
    {
        populateAttributeValues();
    }, [attributes]);

    function getAttributes(): void
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
    }

    // HACK: populating attribute values with placeholders on render. so that handleAttributeValueChange can find an attributeValue in its filter.
    function populateAttributeValues(): void
    {
        setAttributeValues(() =>
        {
            return attributes.map((attr) => ({name: attr.name, value: -1}));
        });
    }

    function handleAttributeValueChange(name: string, value: string)
    {
        const nvalue = Number(value);
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
            <View key={idx}>
                <TextInput
                    placeholder={attribute.name}
                    onChangeText={(value) =>
                        handleAttributeValueChange(attribute.name, value)
                    }
                />
                <Text>{attribute.unit}</Text>
            </View>
        ),
    );

    return (
        <View>
            {listAttributeValueBoxes}
            <Pressable onPress={() => handleSubmit(attributeValues)}>
                <Text>✓</Text>
            </Pressable>
        </View>
    );
}
