import {View, Text, Pressable} from "react-native";
import {useState, useEffect} from "react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import {SafeAreaView} from "react-native-safe-area-context";
import {useRouter, useLocalSearchParams} from "expo-router";

import {useMachineContext} from "@/util/machineContext";
import {Machine} from "@/types/machine";

export default function Statistics()
{
    const [machine, setMachine] = useState<Machine>();
    const {machines, setMachines} = useMachineContext();
    const router = useRouter();

    // Receives machineId passed from workout select
    let {machineId} = useLocalSearchParams<{machineId?: string}>();

    useEffect(() =>
    {
        setMachine(machineIdToMachine(machineId));
    }, [machineId]);

    const machineIdToMachine = (machineId?: string) =>
    {
        if (machines)
        {
            return machines.filter((machine) => machine._id === machineId)[0];
        }
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white pt-4">
            <View className="flex-row">
                <View className="pl-4 pt-4 pb-2">
                    <Text className="text-3xl font-semibold text-black tracking-tight">
                        Statistics
                    </Text>
                </View>
                <Pressable
                    className="flex-1 shadow-sm p-4 mt-2 mb-2 ml-8 mr-8 rounded-md bg-yellow-400 items-center active:opacity-80 transition-all duration-200"
                    onPress={() =>
                        router.push({
                            pathname: "/selectMachine",
                            params: {returnPath: "/(tabs)/stats"},
                        })
                    }
                >
                    <Text className="color-white font-semibold">
                        Select Machine
                    </Text>
                </Pressable>
            </View>
            <View>
                <Text>
                    Displaying stats for {machineIdToMachine(machineId)?.name}
                </Text>
            </View>
        </SafeAreaView>
    );
}
