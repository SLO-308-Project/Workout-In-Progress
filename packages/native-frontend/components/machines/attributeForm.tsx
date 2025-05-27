import {Unit} from "@/types/unit";
import {Attribute} from "@/types/attribute";
import {useState} from "react";
import {View, TextInput, Pressable} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import WheelPicker from "@quidone/react-native-wheel-picker";

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

    const unitData = Object.entries(Unit).map(([value, label]) => ({
        value: label,
        label: label,
    }));

    return (
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-2 flex-row justify-between items-center">
            <TextInput
                value={attribute.name}
                className="w-60 bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black"
                placeholder="Attribute name"
                placeholderTextColor="#A0A0A0"
                onChangeText={(name) => handleNameChange(name)}
            />
            <WheelPicker
                data={unitData}
                value={attribute.unit}
                onValueChanged={({item: {value}}) => handleUnitChange(value)}
                itemHeight={27}
                visibleItemCount={3}
                width={64}
                itemTextStyle={{fontSize: 16}}
            />
            <Pressable
                onPress={() => handleAddAttribute(attribute)}
                className="p-2 rounded-full active:scale-90"
            >
                <AntDesign name="pluscircle" size={24} color="#34C759" />
            </Pressable>
        </View>
    );
}

export default AttributeForm;
