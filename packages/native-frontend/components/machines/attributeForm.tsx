import {Unit} from "@/types/unit";
import {Attribute} from "@/types/attribute";
import {useState} from "react";
import {View, TextInput, Pressable, Text, Platform} from "react-native";
import {Picker} from "@react-native-picker/picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import {validateAttributeName} from "@/util/machineValidator";
import WheelPicker from "@quidone/react-native-wheel-picker";

type Props = {
    handleAddAttribute: (attribute: Attribute) => boolean;
};

function AttributeForm({handleAddAttribute}: Props)
{
    const [attribute, setAttribute] = useState<Attribute>({
        name: "",
        unit: Unit.LBS, // default is the first unit in the enum. which is lbs
    });

    const unitData = Object.entries(Unit).map(([value, label]) => ({
        value: label,
        label: label,
    }));

    const [showError, setShowError] = useState(false);

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
        if (showError)
        {
            setShowError(false);
        }
    }

    function handleAdd()
    {
        //Pre api call validate input.
        if (!validateAttributeName(attribute.name).isValid)
        {
            setShowError(true);
            return;
        }
        // validator passed to try to add attribute.
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
                {Platform.OS !== "web" && (
                    <WheelPicker
                        data={unitData}
                        value={attribute.unit}
                        onValueChanged={({item: {value}}) =>
                            handleUnitChange(value)
                        }
                        itemHeight={27}
                        visibleItemCount={3}
                        width={64}
                        itemTextStyle={{fontSize: 16}}
                    />
                )}
                {Platform.OS === "web" && (
                    <Picker
                        className="w-20 bg-gray-100 px-4 py-3 border-gray-200 rounded-xl text-base 900 items-center"
                        prompt="Units"
                        onValueChange={(value: Unit) =>
                        {
                            handleUnitChange(value);
                        }}
                    >
                        {Object.values(Unit).map((unit, index) => (
                            <Picker.Item
                                key={index}
                                label={unit}
                                value={unit}
                            />
                        ))}
                    </Picker>
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
