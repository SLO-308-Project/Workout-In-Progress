import {useState, useLayoutEffect} from "react";
import {useNavigation, useRouter} from "expo-router";
import {Alert, Text, TextInput, View, Button, FlatList} from "react-native";

import AttributeForm from "@/components/machines/attributeForm";
import AttributeComponent, {
    Empty,
} from "@/components/machines/attributeComponent";
import {Attribute} from "@/types/attribute";
import {Unit} from "@/types/unit";
import {Machine} from "@/types/machine";
import {fetchPostMachine} from "@/fetchers/machineFetchers";

const defaultAttributes: Attribute[] = [
    {
        name: "Weight",
        unit: Unit.LBS,
    },
    {
        name: "Reps",
        unit: Unit.REPS,
    },
];

export default function MachineForm()
{
    const [machine, setMachine] = useState<Machine>({
        _id: "",
        name: "",
        muscle: "",
        attributes: defaultAttributes,
    });
    const navigation = useNavigation();
    const router = useRouter();

    async function addOneMachine(machine: Machine)
    {
        console.log(`${machine.name} ${machine.muscle}`);
        return fetchPostMachine(machine)
            .then((res) =>
            {
                if (res.status === 201)
                {
                    return res.json();
                }
            })
            .then((res_data) =>
            {
                console.log(`RES_DATA=${JSON.stringify(res_data)}`);
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
    }

    function handleNameChange(name: string)
    {
        setMachine({
            ...machine,
            name: name,
        });
    }

    function handleMuscleChange(muscle: string)
    {
        setMachine({
            ...machine,
            muscle: muscle,
        });
    }

    function addAttribute(attribute: Attribute)
    {
        setMachine({
            ...machine,
            attributes: [...machine.attributes, attribute],
        });
    }

    function deleteAttribute(attributeName: string)
    {
        setMachine({
            ...machine,
            attributes: machine.attributes.filter(
                (attr) => attr.name !== attributeName,
            ),
        });
    }

    async function submitForm()
    {
        console.log(`IN SUBMITFORM: ${JSON.stringify(machine.attributes)}`);
        console.log(`name: ${machine.name} muscle: ${machine.muscle}`);
        if (!machine.name || !machine.muscle)
        {
            Alert.alert("Missing name or muscle.");
        }
        else if (machine.attributes.length === 0)
        {
            Alert.alert("At least 1 attribute required.");
        }
        else
        {
            await addOneMachine(machine);
            router.back();
        }
    }

    useLayoutEffect(() =>
    {
        navigation.setOptions({
            headerRight: () => <Button title="Save" onPress={submitForm} />,
        });
    }, [navigation, submitForm]);

    return (
        <View className="flex-1 bg-white pt-4 pl-4">
            <TextInput
                className="w-80 font-bold bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                value={machine.name}
                onChangeText={(text) => handleNameChange(text)}
                placeholder="Name"
                placeholderTextColor="#9CA3AF" // lighter muted gray
                textAlignVertical="center"
                style={{lineHeight: 32, fontSize: 28}}
                autoCapitalize="none"
            />
            <TextInput
                className="w-40 bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                value={machine.muscle}
                onChangeText={(text) => handleMuscleChange(text)}
                placeholder="Muscle"
                placeholderTextColor="#9CA3AF" // lighter muted gray
                textAlignVertical="center"
                style={{lineHeight: 16}}
                autoCapitalize="none"
            />
            <Text className="px-4 text-2xl font-semibold text-black tracking-tight pt-4">
                Attributes
            </Text>
            <FlatList
                data={machine.attributes}
                renderItem={({item, index}) => (
                    <AttributeComponent
                        key={index}
                        name={item.name}
                        unit={item.unit}
                        handleDelete={deleteAttribute}
                    />
                )}
                ListEmptyComponent={<Empty />}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <AttributeForm handleAddAttribute={addAttribute} />
                }
            />
        </View>
    );
}
