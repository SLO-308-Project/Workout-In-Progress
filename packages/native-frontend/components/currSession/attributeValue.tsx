import {View, Text} from "react-native";

type Props = {
    name: string;
    value: number;
};

export default function AttributeValueComponent({name, value}: Props)
{
    return (
        <View>
            <Text>
                {name}: {value}
            </Text>
        </View>
    );
}
