import { Unit } from "@/types/unit";
import { Attribute } from "@/types/attribute";
import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
    handleAddAttribute: (attribute: Attribute) => void;
}

function AttributeForm({ handleAddAttribute }: Props) {
    const [attribute, setAttribute] = useState<Attribute>({
        name: "",
        unit: Unit.LBS, // default is the first unit in the enum. which is lbs
    });

    const listAttributeEnum = Object.keys(Unit).map((opt: string) => (
        <Picker.Item key={opt} label={Unit[opt]} value={Unit[opt]} />
    ));

    function handleUnitChange(unit: Unit) {
        setAttribute({
            ...attribute,
            unit: unit,
        });
    }

    function handleNameChange(name: string) {
        setAttribute({
            ...attribute,
            name: name,
        });
    }

    return (
        <View className="attributeForm">
            <TextInput value={attribute.name} className="w-full bg-white px-4 py-3 border border-gray-300 rounded-xl text-base mb-4" placeholder="Attribute name" onChangeText={(name) => handleNameChange(name)} />
            <Picker selectedValue={attribute.unit} onValueChange={(value) => handleUnitChange(value)}>
                {listAttributeEnum}
            </Picker>
            <Pressable className="bg-blue-600 px-6 py-3 rounded-xl" onPress={() => handleAddAttribute(attribute)}><Text>Add Attribute</Text></Pressable>
        </View>
    );
}

export default AttributeForm;
