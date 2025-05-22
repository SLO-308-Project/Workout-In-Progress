import {Unit} from "@/types/unit";
import {Attribute} from "@/types/attribute";
import {useState} from "react";
import {View, TextInput, Pressable, Text} from "react-native";
import {Picker} from "@react-native-picker/picker";
import AntDesign from "@expo/vector-icons/AntDesign";
// import ScrollPicker from "react-native-wheel-scrollview-picker";

type Props = {
    handleAddAttribute: (attribute: Attribute) => void;
};

function AttributeForm({handleAddAttribute}: Props)
{
    const [attribute, setAttribute] = useState<Attribute>({
        name: "",
        unit: Unit.LBS, // default is the first unit in the enum. which is lbs
    });

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
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-2 flex-row justify-between items-center">
            <TextInput
                value={attribute.name}
                className="w-60 bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black"
                placeholder="Attribute name"
                placeholderTextColor="#A0A0A0"
                onChangeText={(name) => handleNameChange(name)}
            />

            <Picker
                className="w-20 bg-gray-100 px-4 py-3 border-gray-200 rounded-xl text-base 900 items-center"
                prompt="Units"
                onValueChange={(value: Unit) =>
                {
                    handleUnitChange(value);
                }}
            >
                {Object.values(Unit).map((unit, index) => (
                    <Picker.Item key={index} label={unit} value={unit} />
                ))}
            </Picker>

            <Pressable
                onPress={() => handleAddAttribute(attribute)}
                className="p-2 rounded-full active:scale-90"
            >
                <AntDesign name="pluscircle" size={24} color="#34C759" />
            </Pressable>
        </View>
    );
}
// <Pressable
//     className="w-20 bg-gray-100 px-4 py-3 border-gray-200 rounded-xl text-base 900 items-center"
// >
//     <Text className="justify-center">{attribute.unit}</Text>
// </Pressable>

export default AttributeForm;
