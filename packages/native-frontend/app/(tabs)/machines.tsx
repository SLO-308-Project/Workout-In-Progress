import "@/global.css";
import { Text, FlatList, Pressable, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SearchBar } from "@rneui/themed";
import { useRouter, useFocusEffect } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

import MachineComponent, { Empty } from "@/components/machines/machineComponent";
import {
    fetchGetMachine,
    fetchPostMachine,
    fetchDeleteMachine,
} from "@/fetchers/machineFetchers";

import { Machine } from "@/types/machine";

function MachinePage() {
    const [machines, setMachine] = useState<Machine[]>([]);
    const [search, setSearch] = useState<string>("");
    const router = useRouter();
    const isFocused = useIsFocused();

    const updateSearch = (search: string) => {
        setSearch(search);
    };

    useEffect(() => {
        if (isFocused)
            getMachines();
    }, [isFocused]);

    function getMachines(): void {
        fetchGetMachine()
            .then((res: Response) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((res_data) => {
                console.log(`GETMACHINES RES_DATA=${res_data}`);
                setMachine(res_data);
            })
            .catch((error: unknown) => console.log(error));
    }

    function addOneMachine(machine: Machine): void {
        console.log(`${machine.name} ${machine.muscle}`);
        fetchPostMachine(machine)
            .then((res) => {
                if (res.status === 201) {
                    return res.json();
                }
            })
            .then((res_data) => {
                console.log(`RES_DATA=${JSON.stringify(res_data)}`);
                setMachine([...machines, res_data]);
            })
            .catch((error: unknown) => {
                console.log(error);
            });
    }

    function removeOneMachine(name: string) {
        fetchDeleteMachine(name)
            .then((res) => {
                if (res.ok) {
                    setMachine(
                        machines.filter((machine) => machine.name !== name),
                    );
                }
            })
            .catch((error: unknown) => {
                console.log(error);
            });
    }

    // const listMachines = machines.map((machine: Machine) => (
    //     <MachineComponent
    //         key={machine.name}
    //         machine={machine}
    //         handleDelete={removeOneMachine}
    //     />
    // ));
    //
    function filterMachines() {
        if (search === "") {
            return machines;
        }
        return machines.filter((machine: Machine) => {
            return machine.name.toLowerCase().includes(search.toLowerCase());
        });
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white pt-4">
            <View className="flex-row justify-between">
                <Text className="text-3xl font-semibold text-black tracking-tight px-4 pt-4 pb-1">
                    Machines
                </Text>
                <Pressable
                    className="pr-4"
                    onPress={() => router.push("/newMachine")}
                >
                    <AntDesign name="plus" size={32} color="black" />
                </Pressable>
            </View>
            <SearchBar
                containerStyle={styles.containerStyle}
                inputStyle={styles.inputStyle}
                inputContainerStyle={styles.inputContainerStyle}
                placeholder="Search"
                onChangeText={updateSearch}
                value={search}
                lightTheme
                round
            />
            <FlatList
                data={filterMachines()}
                renderItem={({ item, index }) => (
                    <MachineComponent
                        key={index}
                        machine={item}
                        handleDelete={removeOneMachine}
                    />
                )}
                ListEmptyComponent={<Empty />}
                showsVerticalScrollIndicator={false}
                className="flex-1"
            />
        </SafeAreaView>
    );
}
export default MachinePage;

// SearchBar component wants a Stylesheet type passed to its props (so I can't use tailwind)
const styles = StyleSheet.create({
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
// <MachineForm handleSubmit={addOneMachine} />
