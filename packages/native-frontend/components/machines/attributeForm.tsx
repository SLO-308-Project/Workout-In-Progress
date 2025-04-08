import { Unit } from "@/types/unit";
import { Attribute } from "@/types/attribute";
import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

// WHATS BEEN DONE:
// Setup skeleton for porting
// Ported (but didn't test) attributeComponent
// Installed react-native-picker
// WHERE TO PICKUP:
// Port over:
// attributeForm
// machineComponent
// machineForm
// Should have working machine page by the end... hopefully...

type Props = {
    handleAddAttribute: (attribute: Attribute) => void;
}

function AttributeForm({ handleAddAttribute }: Props) {
    const [attribute, setAttribute] = useState<Attribute>({
        name: "",
        unit: Unit["LBS"], // default is the first unit in the enum. which is lbs
    });

    const listAttributeEnum = Object.keys(Unit).map((opt: string) => (
        <Picker.Item key={opt} label={Unit[opt]} value={opt} />
    ));

    function handleUnitChange(unit: Unit) {
        setAttribute({
            ...attribute,
            unit: Unit[unit],
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
            <TextInput placeholder="Attribute name" onChangeText={(name) => handleNameChange(name)} />
            <Picker selectedValue={attribute.unit} onValueChange={handleUnitChange}>
                {listAttributeEnum}
            </Picker>
            <Pressable onPress={handleAddAttribute}><Text>Add Attribute</Text></Pressable>
        </View>
    );
}

export default AttributeForm;
