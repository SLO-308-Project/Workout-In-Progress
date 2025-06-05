import "@/global.css";
import {Text, FlatList, Pressable, View, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useState, useEffect, useCallback, useRef} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {SearchBar} from "@rneui/themed";
import {useRouter} from "expo-router";
import {useIsFocused} from "@react-navigation/native";
import {BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";

import MachineComponent, {Empty} from "@/components/machines/machineComponent";
import {
    fetchGetMachine,
    fetchDeleteMachine,
    fetchUpdateMachine,
} from "@/fetchers/machineFetchers";

import {Machine} from "@/types/machine";
import MachineSlide from "@/components/machines/machineEditSlide";
import {useMachineContext} from "@/util/machineContext";

const isCypress =
    typeof window !== "undefined" && window.__IS_CYPRESS__ === true;

function MachinePage()
{
    const {machines, setMachines} = useMachineContext();
    const [search, setSearch] = useState<string>("");
    const router = useRouter();
    const isFocused = useIsFocused();

    useEffect(() =>
    {
        console.log("Machines is Focused");
        if (isFocused) getMachines();
    }, [isFocused, router]);

    // State for Edit Bottom Sheet Modal
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(
        null,
    );

    // State for machines list refresh functionality
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    function handleRefresh()
    {
        setIsRefreshing(true);
        getMachines();
    }

    // Called when a machine card is tapped
    const handleOpenSheet = useCallback((machine: Machine) =>
    {
        setSelectedMachine(machine);
        bottomSheetModalRef.current?.present();
    }, []);

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

    // Called by edit slide to update machine
    async function updateMachine(machine: Machine, newMachine: Machine)
    {
        return fetchUpdateMachine(machine.name, newMachine)
            .then((res) =>
            {
                if (res.ok)
                {
                    // Update local list
                    setMachines(
                        machines.map((oldMachine) =>
                            oldMachine._id === newMachine._id
                                ? {...oldMachine, ...newMachine}
                                : oldMachine,
                        ),
                    );
                }
            })
            .catch((error: unknown) =>
            {
                console.log(error);
            });
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

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white pt-4">
            <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
                <Text className="text-3xl font-semibold text-black tracking-tight">
                    Machines
                </Text>
                <Pressable
                    className=""
                    onPress={() => router.push("/newMachine")}
                >
                    <AntDesign name="plus" size={32} color="black" />
                </Pressable>
            </View>
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
                    <View testID={`machine-item`} key={index}>
                        <MachineComponent
                            onPress={() => handleOpenSheet(item)}
                            key={index}
                            machine={item}
                            handleDelete={removeOneMachine}
                        />
                    </View>
                )}
                ListEmptyComponent={<Empty />}
                showsVerticalScrollIndicator={false}
                className="flex-1"
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                initialNumToRender={isCypress ? 10000 : 10}
            />
            <BottomSheetModal
                ref={bottomSheetModalRef}
                backgroundStyle={{
                    backgroundColor: "#F9F9F9",
                }}
                index={0}
                snapPoints={["90%"]}
                enableDynamicSizing={false}
                enableHandlePanningGesture={true}
                enableContentPanningGesture={false}
                enablePanDownToClose={true}
            >
                <BottomSheetScrollView>
                    <MachineSlide
                        currMachine={selectedMachine}
                        handleUpdate={updateMachine}
                    />
                </BottomSheetScrollView>
            </BottomSheetModal>
        </SafeAreaView>
    );
}
export default MachinePage;

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
