import {useState, useLayoutEffect} from "react";
import {useNavigation, useRouter} from "expo-router";
import {
    Alert,
    Text,
    Pressable,
    TextInput,
    View,
    Button,
    FlatList,
} from "react-native";

import AttributeForm from "@/components/machines/attributeForm";
import AttributeComponent, {
    Empty,
} from "@/components/machines/attributeComponent";
import {Attribute} from "@/types/attribute";
import {Unit} from "@/types/unit";
import {Machine} from "@/types/machine";
import {fetchPostMachine} from "@/fetchers/machineFetchers";
import {
    validateMachineName,
    validateMuscleName,
    validateAttributeName,
} from "@/util/machineValidator";

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
    const [showMachineNameError, setShowMachineNameError] =
        useState<boolean>(false);
    const [showMuscleNameError, setShowMuscleNameError] =
        useState<boolean>(false);
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
        if (showMachineNameError)
        {
            setShowMachineNameError(false);
        }
    }

    function handleMuscleChange(muscle: string)
    {
        setMachine({
            ...machine,
            muscle: muscle,
        });
        if (showMuscleNameError)
        {
            setShowMuscleNameError(false);
        }
    }

    function addAttribute(attribute: Attribute)
    {
        const attributeValidation = validateAttributeName(attribute.name);
        if (!attributeValidation.isValid)
        {
            return false;
        }

        setMachine({
            ...machine,
            attributes: [...machine.attributes, attribute],
        });
        return true;
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

        const nameValidation = validateMachineName(machine.name);
        if (!nameValidation.isValid)
        {
            setShowMachineNameError(true);
            return;
        }

        const muscleValidation = validateMuscleName(machine.muscle);
        if (!muscleValidation.isValid)
        {
            setShowMuscleNameError(true);
            return;
        }

        if (machine.attributes.length === 0)
        {
            Alert.alert("At least 1 attribute required.");
        }
        else
        {
            await addOneMachine(machine);
            router.back();
        }
    }

    const listAttributes = machine.attributes ? (
        machine.attributes.map((attribute: Attribute, index) => (
            <AttributeComponent
                key={index}
                name={attribute.name}
                unit={attribute.unit}
                handleDelete={deleteAttribute}
            />
        ))
    ) : (
        <></>
    );

    useLayoutEffect(() =>
    {
        navigation.setOptions({
            headerRight: () => <Button title="Save" onPress={submitForm} />,
        });
    }, [navigation, submitForm]);

    return (
        <View className="flex-1 bg-white pt-4 pl-4">
            <TextInput
                className="w-80 bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-2"
                value={machine.name}
                maxLength={50}
                onChangeText={(text) => handleNameChange(text)}
                placeholder="Name"
                placeholderTextColor="#9CA3AF"
                textAlignVertical="center"
                style={{lineHeight: 32, fontSize: 28}}
                autoCapitalize="none"
            />
            {showMachineNameError && (
                <Text className="text-red-500 text-sm mb-2">
                    Machine name can only contain letters, numbers, spaces,
                    underscores, and hyphens
                </Text>
            )}
            <View className="mb-2" />
            <TextInput
                className="w-40 bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-2"
                value={machine.muscle}
                maxLength={20}
                onChangeText={(text) => handleMuscleChange(text)}
                placeholder="Muscle"
                placeholderTextColor="#9CA3AF"
                textAlignVertical="center"
                style={{lineHeight: 16}}
                autoCapitalize="none"
            />
            {showMuscleNameError && (
                <Text className="text-red-500 text-sm mb-2">
                    Muscle name can only contain letters and spaces
                </Text>
            )}
            <View className="mb-2" />
            <Text className="text-2xl font-semibold text-black tracking-tight pt-4">
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
