import {View, Text, Pressable, Platform} from "react-native";
import {useState, useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useRouter, useLocalSearchParams} from "expo-router";
import WheelPicker from "@quidone/react-native-wheel-picker";
import {CartesianChart, Line, useChartPressState} from "victory-native";
import {useFont, Circle} from "@shopify/react-native-skia";
import {SharedValue, useDerivedValue, runOnJS} from "react-native-reanimated";

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

interface ChartPadding
{
    left: number;
    right: number;
    bottom: number;
    top: number;
}

const roboto = require("@/assets/fonts/Roboto.ttf");

export default function Statistics()
{
    const [sessions, setSessions] = useState<Session[]>([]);
    const [machine, setMachine] = useState<Machine>();
    const [attrName, setAttrName] = useState<string>();
    const [statsData, setStatsData] = useState<StatsData | undefined>();
    const [notEnoughDataError, setNotEnoughDataError] =
        useState<boolean>(false);

    // Necessary for the values to change when dragging on graph
    const [yVal, setYVal] = useState<string>();
    const [xVal, setXVal] = useState<string>();

    const {state, isActive} = useChartPressState({x: "", y: {value: 0}});
    const {machines} = useMachineContext();
    const router = useRouter();
    const isFocused = useIsFocused();

    // Receives machineId passed from workout select
    let {machineId} = useLocalSearchParams<{machineId?: string}>();

    // Font for axis labels
    const font12 = useFont(roboto, 12);

    // Define chart padding
    const chartPadding: ChartPadding = {
        left: 16,
        right: 18,
        bottom: 64,
        top: 32,
    };

    // Chain of use effects ensures that dependencies are ready before attempting to harvest data
    useEffect(() =>
    {
        if (isFocused)
        {
            loadSessions();
        }
    }, [isFocused]);

    useEffect(() =>
    {
        if (machineId)
        {
            setMachine(machineIdToMachine(machineId));
        }
    }, [machineId]);

    useEffect(() =>
    {
        if (machine)
        {
            setAttrName(machine?.attributes[0].name); // Sets the top level attribute will be first to get stats
        }
    }, [machine]);

    useEffect(() =>
    {
        if (attrName)
        {
            const dataPoints = harvestDataPoints();
            if (dataPoints !== undefined)
            {
                setStatsData(dataPoints);
            }
            else
            {
                setStatsData(undefined);
            }
        }
    }, [attrName]);

    const machineIdToMachine = (machineId?: string) =>
    {
        if (machines)
        {
            return machines.filter((machine) => machine._id === machineId)[0];
        }
    };

    // Harvests all relevant data points from all of users sessions
    // X -> date, Y -> value
    // If multiple workouts on the same day, give the max for the day
    const harvestDataPoints = (): StatsData | undefined =>
    {
        setNotEnoughDataError(false);
        let internalError: boolean = false; // need an internal flag as well. Can't rely on notEnoughDataError state
        // Retrieves all the data points
        const sessionData = sessions
            .map((session) =>
            {
                // Match relevant workouts
                const relevantWO = session.workout.filter(
                    (workout) =>
                        workout.machineId === machineId &&
                        workout.sets.length > 0,
                );

                // Need at least 2 points to plot a line

                const WOAttrValue = relevantWO.map((workout) =>
                {
                    return workout.sets.map((set) =>
                    {
                        return set.attributeValues.filter((attr) =>
                        {
                            return (
                                attr.name.toLowerCase() ===
                                attrName?.toLowerCase()
                            );
                        });
                    });
                });

                if (WOAttrValue.length === 0)
                {
                    return {
                        date: "",
                        value: NaN,
                    };
                }

                // Only return the maximum value if multiple workouts for the same session
                const largestValue: number = Math.max(
                    ...WOAttrValue[0][0].map((attrValue) => attrValue.value),
                );
                return {
                    date: new Date(session.date)
                        .toLocaleDateString()
                        .toString(),
                    value: largestValue,
                };
            })
            // filter out any null sessions (sessions that didn't have any relevant sets)
            .filter((session) => session)
            // filter out any values that had the machineid but not any sets
            .filter((session) =>
            {
                return session.date !== "" && !isNaN(session.value);
            });

        const numberOfWorkouts = sessionData.length;

        if (numberOfWorkouts <= 1)
        {
            internalError = true;
            setNotEnoughDataError(true);
        }

        if (internalError)
        {
            return undefined;
        }
        else
        {
            return {
                numberOfWorkouts: numberOfWorkouts,
                data: sessionData,
            };
        }
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

    // Updates the value of xVal and yVal on graph drag
    useDerivedValue(() =>
    {
        runOnJS(setXVal)(state.x.value.value.toString());
    }, [state.x.value]);

    useDerivedValue(() =>
    {
        runOnJS(setYVal)(state.y.value.value.value.toString());
    }, [state.y.value]);

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white pt-4">
            {Platform.OS === "web" && (
                <View className="flex-1 items-center bg-white pt-16">
                    <Text className="text-2xl text-gray-300 font-semibold">
                        Statistics are not supported on web.
                    </Text>
                </View>
            )}
            {Platform.OS !== "web" && (
                <>
                    <>
                        <View className="flex-row">
                            <View className="pl-4 pt-4 pb-2">
                                <Text className="text-3xl font-semibold text-black tracking-tight">
                                    Statistics
                                </Text>
                            </View>
                            <Pressable
                                className="flex-1 p-4 mt-2 mb-2 ml-8 mr-8 rounded-md bg-yellow-400 items-center active:opacity-80 transition-all duration-200"
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
                        {notEnoughDataError && (
                            <View className="items-center pt-16">
                                <Text className="text-xl text-red-500 font-bold ">
                                    Not Enough Data on Machine
                                </Text>
                            </View>
                        )}
                    </>
                    {machine && statsData && (
                        <>
                            <View className="flex-1">
                                <View className="flex-row items-center">
                                    <Text className="text-xl font-bold pl-4 pr-2">
                                        {machine.name}
                                    </Text>
                                    <WheelPicker
                                        data={machine?.attributes.map(
                                            (attribute) => ({
                                                value: attribute.name,
                                                label: attribute.name,
                                            }),
                                        )}
                                        value={attrName}
                                        onValueChanged={({item: {value}}) =>
                                            setAttrName(value)
                                        }
                                        itemHeight={27}
                                        visibleItemCount={3}
                                        width={86}
                                        itemTextStyle={{fontSize: 18}}
                                    />
                                    <Text className="text-xl font-bold pl-2 pr-2">
                                        Progression
                                    </Text>
                                </View>
                                <Text className="text-lg pl-4 font-semibold text-gray-400 italic">
                                    {statsData.numberOfWorkouts} workouts found
                                </Text>
                                <View className="items-center top-8">
                                    {isActive ? (
                                        <Text className="text-lg font-semibold">
                                            {yVal} on {xVal}
                                        </Text>
                                    ) : (
                                        <Text className="text-lg font-semibold">
                                            - on -
                                        </Text>
                                    )}
                                </View>
                                <CartesianChart
                                    data={statsData.data}
                                    xKey="date"
                                    yKeys={["value"]}
                                    yAxis={[{font: font12}]}
                                    axisOptions={{lineColor: "transparent"}}
                                    chartPressState={state}
                                    padding={{
                                        left: chartPadding.left,
                                        right: chartPadding.right,
                                        top: chartPadding.top,
                                        bottom: chartPadding.bottom,
                                    }}
                                    domainPadding={{
                                        top: 16,
                                        bottom: 10,
                                        left: 10,
                                        right: 10,
                                    }}
                                    frame={{lineColor: "transparent"}}
                                >
                                    {({points}) => (
                                        <>
                                            <Line
                                                points={points.value}
                                                color="orange"
                                                strokeWidth={5}
                                                animate={{
                                                    type: "timing",
                                                    duration: 100,
                                                }}
                                            />
                                            {isActive && (
                                                <>
                                                    <ToolTip
                                                        xpos={state.x.position}
                                                        ypos={
                                                            state.y.value
                                                                .position
                                                        }
                                                    />
                                                </>
                                            )}
                                        </>
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
                </>
            )}
        </SafeAreaView>
    );
}

function ToolTip({
    xpos,
    ypos,
}: {
    xpos: SharedValue<number>;
    ypos: SharedValue<number>;
})
{
    return (
        <>
            <Circle cx={xpos} cy={ypos} r={8} color="orange" />
        </>
    );
}
