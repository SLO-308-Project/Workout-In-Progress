import {Unit} from "@/types/unit";
import {Attribute} from "@/types/attribute";
import {useState} from "react";
import {View, TextInput, Pressable, Text, Modal} from "react-native";
import {Picker} from "@react-native-picker/picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import {validateAttributeName} from "@/util/machineValidator";

type Props = {
    handleAddAttribute: (attribute: Attribute) => boolean;
};

function AttributeForm({handleAddAttribute}: Props)
{
    const [attribute, setAttribute] = useState<Attribute>({
        name: "",
        unit: Unit.LBS, // default is the first unit in the enum. which is lbs
    });
    const [showPicker, setShowPicker] = useState(false);
    const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
    const [showError, setShowError] = useState(false);

    function handleUnitChange(unitIndex: number)
    {
        const unit = Object.entries(Unit)[unitIndex][1];
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
        if (showError)
        {
            setShowError(false);
        }
    }

    function handleAdd()
    {
        const success = handleAddAttribute(attribute);
        if (!success)
        {
            setShowError(true);
        }
        else
        {
            setAttribute({
                name: "",
                unit: Unit.LBS,
            });
            setShowError(false);
        }
    }

    return (
        <View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-2">
            <View className="flex-row justify-between items-center">
                <TextInput
                    value={attribute.name}
                    maxLength={15}
                    className="w-60 bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black"
                    placeholder="Attribute name"
                    placeholderTextColor="#A0A0A0"
                    onChangeText={(name) => handleNameChange(name)}
                />
                {showPicker && (
                    <ScrollPicker
                        selectedIndex={selectedUnitIdx}
                        onTouchEnd={() => setShowPicker(false)}
                        dataSource={Object.values(Unit)}
                        wrapperBackground="#FFF"
                        wrapperHeight={40}
                        onValueChange={(data, selectedIndex) =>
                        {
                            setSelectedUnitIdx(selectedIndex);
                            handleUnitChange(selectedIndex);
                        }}
                    />
                )}
                {!showPicker && (
                    <Pressable
                        className="w-20 bg-gray-100 px-4 py-3 border-gray-200 rounded-xl text-base 900 items-center"
                        onPress={() => setShowPicker(true)}
                    >
                        <Text className="justify-center">{attribute.unit}</Text>
                    </Pressable>
                )}
                <Pressable
                    onPress={handleAdd}
                    className="p-2 rounded-full active:scale-90"
                >
                    <AntDesign name="pluscircle" size={24} color="#34C759" />
                </Pressable>
            </View>
            {showError && (
                <Text className="text-red-500 text-sm mt-2">
                    Attribute name can only contain letters, numbers, and spaces
                </Text>
            )}
        </View>
    );
}

export default AttributeForm;
