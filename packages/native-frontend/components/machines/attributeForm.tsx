import {Unit} from "@/types/unit";
import {Attribute} from "@/types/attribute";
import {useState} from "react";
import {View, TextInput, Pressable, Text} from "react-native";
import {Picker} from "@react-native-picker/picker";

type Props = {
    handleAddAttribute: (attribute: Attribute) => void;
};

function AttributeForm({handleAddAttribute}: Props)
{
    const [attribute, setAttribute] = useState<Attribute>({
        name: "",
        unit: Unit.LBS, // default is the first unit in the enum. which is lbs
    });

    const listAttributeEnum = Object.keys(Unit).map((opt: string) => (
        <Picker.Item key={opt} label={Unit[opt]} value={Unit[opt]} />
    ));

    function handleUnitChange(unit: Unit)
    {
        setAttribute({
            ...attribute,
            unit: unit,
        });
    }

    function handleNameChange(name: string)
    {
        setAttribute({
            ...attribute,
            name: name,
        });
    }

    return (
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 m-4">
            <TextInput
                value={attribute.name}
                className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-base text-gray-900 mb-4"
                placeholder="Attribute name"
                placeholderTextColor="#A0A0A0"
                onChangeText={(name) => handleNameChange(name)}
            />

            <View className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl mb-4">
                <Picker
                    selectedValue={attribute.unit}
                    onValueChange={(value) => handleUnitChange(value)}
                >
                    {listAttributeEnum}
                </Picker>
            </View>

            <Pressable
                className="bg-blue-600 px-6 py-3 rounded-xl active:opacity-75"
                onPress={() => handleAddAttribute(attribute)}
            >
                <Text className="text-white text-center font-semibold">
                    Add Attribute
                </Text>
            </Pressable>
        </View>
    );
}

export default AttributeForm;
