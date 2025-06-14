import "@/global.css";
import {FlatList, Pressable, View, StyleSheet} from "react-native";
import {useState, useLayoutEffect} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {SearchBar} from "@rneui/themed";
import {
    useRouter,
    useNavigation,
    useLocalSearchParams,
    RelativePathString,
} from "expo-router";

import MachineComponent, {Empty} from "@/components/machines/machineComponent";
import {fetchGetMachine, fetchDeleteMachine} from "@/fetchers/machineFetchers";
import {useMachineContext} from "@/util/machineContext";

import {Machine} from "@/types/machine";

export default function SelectMachine()
{
    const {machines, setMachines} = useMachineContext();
    const [search, setSearch] = useState<string>("");
    const router = useRouter();
    const navigation = useNavigation();

    const {returnPath} = useLocalSearchParams();

    useLayoutEffect(() =>
    {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    className=""
                    onPress={() => router.push("/newMachine")}
                >
                    <AntDesign name="plus" size={32} color="black" />
                </Pressable>
            ),
        });
    }, [navigation]);

    // State for machines list refresh functionality
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    function handleRefresh()
    {
        setIsRefreshing(true);
        getMachines();
    }

    // Called when a machine card is tapped
    const updateSearch = (search: string) =>
    {
        setSearch(search);
    };

    function getMachines(): void
    {
        fetchGetMachine()
            .then((res: Response) =>
            {
                if (res.ok)
                {
                    return res.json();
                }
            })
            .then((res_data) =>
            {
                setMachines(res_data);
                setIsRefreshing(false);
            })
            .catch((error: unknown) => console.log(error));
    }

    function removeOneMachine(name: string)
    {
        fetchDeleteMachine(name)
            .then((res) =>
            {
                if (res.ok)
                {
                    setMachines(
                        machines.filter((machine) => machine.name !== name),
                    );
                }
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
    }

    function filterMachines()
    {
        if (search === "")
        {
            return machines;
        }
        return machines.filter((machine: Machine) =>
        {
            return machine.name.toLowerCase().includes(search.toLowerCase());
        });
    }

    function handleSelectMachine(machineId: string)
    {
        router.dismissTo({
            pathname: returnPath as RelativePathString,
            params: {machineId},
        });
    }

    return (
        <View className="flex-1 bg-white">
            <SearchBar
                containerStyle={sb_styles.containerStyle}
                inputStyle={sb_styles.inputStyle}
                inputContainerStyle={sb_styles.inputContainerStyle}
                placeholder="Search"
                onChangeText={updateSearch}
                value={search}
                lightTheme
                round
            />
            <FlatList
                data={filterMachines()}
                renderItem={({item, index}) => (
                    <MachineComponent
                        onPress={() => handleSelectMachine(item._id)}
                        key={index}
                        machine={item}
                        handleDelete={removeOneMachine}
                    />
                )}
                ListEmptyComponent={<Empty />}
                showsVerticalScrollIndicator={false}
                className="flex-1"
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
            />
        </View>
    );
}

// SearchBar component wants a Stylesheet type passed to its props (so I can't use tailwind)
const sb_styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: "#FFF",
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    inputContainerStyle: {
        backgroundColor: "#F2F2F7",
        height: 35,
    },
    inputStyle: {
        color: "#000",
        fontSize: 16,
    },
});
