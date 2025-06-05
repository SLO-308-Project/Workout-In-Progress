import {useState} from "react";
import {View, Text, Platform, TextInput} from "react-native";

import {Unit} from "@/types/unit";

type Props = {
    name: string;
    value: number;
    unit: Unit | undefined;
    handleValueChange: (name: string, value: number) => void;
};

const ITEM_HEIGHT = 32;
const PICKER_WIDTH = 64;

export default function AttributeValueComponent({
    name,
    value,
    handleValueChange,
    unit,
}: Props)
{
    const [localValue, setLocalValue] = useState<string>(value.toString());

    return (
        <View className="flex-row items-center">
            <TextInput
                style={{
                    width: PICKER_WIDTH,
                    height: ITEM_HEIGHT,
                    zIndex: 10,
                    backgroundColor: "#F2F2F2",
                    fontSize: 18,
                }}
                className="border border-gray-300 rounded-lg"
                defaultValue={""}
                value={localValue.toString()}
                onPressIn={() => setLocalValue("")}
                onChangeText={(text) =>
                {
                    handleValueChange(name, Number(text));
                    setLocalValue(text);
                }}
                keyboardType={Platform.select({
                    ios: "decimal-pad",
                    android: "numeric",
                })}
                textAlign="center"
                maxLength={5}
                caretHidden={false}
                returnKeyType="done"
                autoCorrect={false}
            />
            <Text className="pl-4">{unit}</Text>
        </View>
    );
}
