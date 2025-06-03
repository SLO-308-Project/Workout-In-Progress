import {View, Text, Pressable} from "react-native";
import {useState, useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useRouter, useLocalSearchParams} from "expo-router";
import WheelPicker from "@quidone/react-native-wheel-picker";
import {CartesianChart, Line} from "victory-native";
import {useFont} from "@shopify/react-native-skia";

import {Machine} from "@/types/machine";
import {Session} from "@/types/session";

import {useMachineContext} from "@/util/machineContext";
import {fetchGetSessions} from "@/fetchers/sessionFetchers";

interface StatsData
{
    numberOfWorkouts: number;
    data: {
        date: string;
        value: number;
    }[];
}

const inter = require("@/assets/fonts/Inter.ttf");

export default function Statistics()
{
    const [sessions, setSessions] = useState<Session[]>([]);
    const [machine, setMachine] = useState<Machine>();
    const [attrName, setAttrName] = useState<string>("weight");
    const [statsData, setStatsData] = useState<StatsData>();
    const {machines, setMachines} = useMachineContext();
    const router = useRouter();
    const isFocused = useIsFocused();

    // Receives machineId passed from workout select
    let {machineId} = useLocalSearchParams<{machineId?: string}>();

    const font = useFont(inter, 12);

    useEffect(() =>
    {
        if (isFocused)
        {
            loadSessions();
        }
        if (machineId && isFocused)
        {
            setMachine(machineIdToMachine(machineId));
            setStatsData(harvestDataPoints());
        }
    }, [isFocused, attrName, machineId]);

    const machineIdToMachine = (machineId?: string) =>
    {
        if (machines)
        {
            return machines.filter((machine) => machine._id === machineId)[0];
        }
    };

    // Harvets all relevant data points from all of users sessions
    // X -> date, Y -> value
    // If multiple workouts on the same day, give the max for the day
    const harvestDataPoints = (): StatsData =>
    {
        // Retrieves all the data points
        const sessionData = sessions.map((session) =>
        {
            // Match relevant workouts
            const relevantWO = session.workout.filter(
                (workout) =>
                    workout.machineId === machineId && workout.sets.length > 0,
            );

            // Sessions with no relevant workouts have no value
            if (relevantWO.length === 0)
            {
            }

            const WOAttrValue = relevantWO.map((workout) =>
            {
                return workout.sets.map((set) =>
                {
                    return set.attributeValues.filter((attr) =>
                    {
                        return (
                            attr.name.toLowerCase() === attrName.toLowerCase()
                        );
                    });
                });
            });

            // Only return the maximum value if multiple workouts for the same session
            const largestValue: number = Math.max(
                ...WOAttrValue[0][0].map((attrValue) => attrValue.value),
            );
            return {
                date: new Date(session.date).toLocaleDateString().toString(),
                value: largestValue,
            };
        });

        const numberOfWorkouts = sessionData.length;

        return {
            numberOfWorkouts: numberOfWorkouts,
            data: sessionData,
        };
    };

    function loadSessions(): void
    {
        fetchGetSessions()
            .then((res: Response) => res.json())
            .then((data: Session[]) =>
            {
                setSessions(data);
            })
            .catch((error: unknown) => console.log(error));
    }

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
            {machine && statsData && (
                <>
                    <WheelPicker
                        data={machine?.attributes.map((attribute) => ({
                            value: attribute.name,
                            label: attribute.name,
                        }))}
                        value={attrName}
                        onValueChanged={({item: {value}}) => setAttrName(value)}
                        itemHeight={27}
                        visibleItemCount={3}
                        width={64}
                        itemTextStyle={{fontSize: 16}}
                    />
                    <View className="flex-1" style={{height: 500, width: 500}}>
                        <Text>
                            Progress on {attrName} for {machine.name}
                        </Text>
                        <Text>{JSON.stringify(statsData.data)}</Text>
                        <CartesianChart
                            data={statsData.data}
                            xKey="date"
                            yKeys={["value"]}
                            axisOptions={{font}}
                        >
                            {({points}) => (
                                <Line
                                    points={points.value}
                                    color="orange"
                                    strokeWidth={4}
                                    animate={{type: "timing", duration: 300}}
                                />
                            )}
                        </CartesianChart>
                    </View>
                </>
            )}
            {!machine && (
                <View className="flex-1 items-center bg-white pt-16">
                    <Text className="text-2xl text-gray-300 font-semibold">
                        Select a Machine
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}
