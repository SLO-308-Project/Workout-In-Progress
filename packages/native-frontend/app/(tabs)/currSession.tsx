import {View, Text, Pressable, FlatList} from "react-native";
import {useState, useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useIsFocused} from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useRouter, useLocalSearchParams} from "expo-router";

import {Machine} from "@/types/machine";
import {Session} from "@/types/session";
import {Workout} from "@/types/workout";

import WorkoutComponent, {
    Empty,
} from "@/components/currSession/workoutComponent";

import {
    fetchGetWorkouts,
    fetchPostWorkout,
    fetchDeleteWorkout,
} from "@/fetchers/workoutFetchers";

import {fetchGetMachine} from "@/fetchers/machineFetchers";

import {
    fetchStartSessions,
    fetchEndSession,
    fetchCurrentSession,
    fetchGetSessions,
} from "@/fetchers/currentSessionFetchers";

const clockSpeed = 200;

export default function CurrentSessionPage()
{
    const [sessions, setSessions] = useState<Session | null>(null);
    const [sessionNum, setSessionNum] = useState<number | null>(null);
    const [time, setTime] = useState(0);
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    const isFocused = useIsFocused();
    const router = useRouter();

    // Receives machineId passed from workout select
    let {machineId} = useLocalSearchParams<{machineId?: string}>();

    useEffect(() =>
    {
        if (machineId)
        {
            addWorkout(machineId);
        }
    }, [machineId]);

    // State for the users currently selected machine
    const [machines, setMachines] = useState<Machine[]>([]);
    useEffect(() =>
    {
        if (isFocused)
        {
            getMachines();
            getCurrentSession();
            getSessionNumber();
        }
    }, [isFocused]);

    // Helper function for duration formatting
    // Converts database time which is stored in seconds to hours and minutes
    function formatDuration(milliseconds: number): string
    {
        const hours = Math.floor(milliseconds / 3600 / 1000);
        const minutes = Math.floor((milliseconds / 60 / 1000) % 60);
        const second = Math.floor((milliseconds / 1000) % 60);
        return `${hours}h ${minutes}m ${second}s`;
    }

    // Getting workouts is triggered whenever the current session is updated
    useEffect(() =>
    {
        if (sessions !== null)
        {
            getWorkouts(sessions);
            const interval = setInterval(() =>
            {
                setTime((time) => time + clockSpeed / 1000);
            }, clockSpeed);

            return () => clearInterval(interval);
        }
    }, [sessions]);

    function startSession(): void
    {
        if (sessions !== null)
        {
            return;
        }
        fetchStartSessions()
            .then((res) =>
            {
                if (res.status === 201)
                {
                    return res.json();
                }
                else
                {
                    console.log("Nothing Found");
                }
            })
            .then((json: Session) =>
            {
                setSessions(json);
                setSessionNum(sessionNum! + 1);
            })
            .catch((err: unknown) =>
            {
                console.log("Error starting session: ", err);
            });
    }

    function endSession(): void
    {
        if (sessions === null)
        {
            return;
        }
        fetchEndSession(sessions._id)
            .then((res) =>
            {
                if (res.status === 201)
                {
                    setSessions(null);
                }
                else
                {
                    console.log("No session found");
                }
            })
            .catch((err: unknown) =>
            {
                console.log("Error ending session: ", err);
            });
    }

    function getMachines(): void
    {
        fetchGetMachine()
            .then((res: Response) => res.json())
            .then((json) =>
            {
                setMachines(json);
            })
            .catch((error: unknown) => console.log(error));
    }

    /*
     * Dispatches the request to get the current session, sets the current session.
     * */
    function getCurrentSession(): void
    {
        fetchCurrentSession()
            .then((res) =>
            {
                if (res.status === 200)
                {
                    console.log("200");
                    return res.json();
                }
                else if (res.status === 204)
                {
                    console.log("204");
                    return null;
                }
            })
            .then((json: Session[]) =>
            {
                if (json === null)
                {
                    console.log("No session is started");
                    setSessions(null);
                }
                else
                {
                    setSessions(json[0]);
                }
            })
            .catch((err: unknown) =>
            {
                console.log("Error getting current session: ", err);
                throw new Error(`Error getting current session: ${err}`);
            });
    }

    function getSessionNumber(): void
    {
        fetchGetSessions()
            .then((res) =>
            {
                if (res.status === 200)
                {
                    return res.json();
                }
                else
                {
                    throw new Error("No sessions found");
                }
            })
            .then((json: Session[]) =>
            {
                console.log(`session number: ${json.length}`);
                setSessionNum(json.length);
            })
            .catch((err: unknown) =>
            {
                console.log("Error getting session number ", err);
            });
    }

    function getWorkouts(session: Session): void
    {
        fetchGetWorkouts(session._id)
            .then((res) =>
            {
                console.log(res);
                if (res.status === 201)
                {
                    const text = res.text();
                    console.log(text);
                    return text;
                }
                else
                {
                    throw new Error("Failed to get workouts");
                }
            })
            .then((json) =>
            {
                const newJson = JSON.parse(json);
                console.log(newJson);
                setWorkouts(newJson);
            })
            .catch((x) => console.log(x));
    }

    function addWorkout(machineId: string): void
    {
        console.log("inside of add workout");
        if (sessions === null)
        {
            throw new Error("Could not get session. Session does not exist.");
        }
        if (sessions && machineId)
        {
            fetchPostWorkout(sessions._id, machineId)
                .then((res) =>
                {
                    if (res.ok)
                    {
                        router.setParams({machineId: undefined});
                        return res.json();
                    }
                    else
                    {
                        router.setParams({machineId: undefined});
                        throw new Error();
                    }
                })
                .then((res_data: Session) =>
                {
                    setWorkouts(res_data.workout);
                })
                .catch((error: unknown) => console.log(error));
        }
    }

    function removeWorkout(workoutId: string): void
    {
        if (sessions && workoutId)
        {
            fetchDeleteWorkout(sessions._id, workoutId)
                .then((res) =>
                {
                    if (res.ok)
                    {
                        const new_workouts = workouts.filter(
                            (workout) => workout._id !== workoutId,
                        );
                        setWorkouts(new_workouts);
                    }
                    else
                    {
                        throw new Error();
                    }
                })
                .catch((error: unknown) => console.log(error));
        }
    }

    const machineIdToName = (machineId: string) =>
    {
        if (machines)
        {
            return machines.filter((machine) => machine._id === machineId)[0]
                .name;
        }
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
            {!sessions && (
                <View className="flex-1 items-center bg-white">
                    <Text className="text-3xl font-semibold text-black tracking-tight pb-16 pt-4 px-4">
                        No Active Session
                    </Text>
                    <Pressable
                        onPress={startSession}
                        className="w-60 h-60 bg-green-100 rounded-full justify-center items-center active:opacity-80 transition-all duration-200"
                    >
                        <Text className="text-green-600 text-xl font-semibold">
                            Start Session
                        </Text>
                    </Pressable>
                </View>
            )}
            {sessions && (
                <>
                    <View className="flex-row justify-between items-center px-4 pt-4">
                        <Text className="text-3xl font-semibold text-black tracking-tight">
                            Current Session
                        </Text>
                        <Pressable
                            className=""
                            onPress={() => router.push("/selectMachine")}
                        >
                            <AntDesign name="plus" size={32} color="black" />
                        </Pressable>
                    </View>
                    <Text className="text-lg font-bold text-neutral-700 px-4">
                        {formatDuration(
                            Date.now() - new Date(sessions!.date).getTime(),
                        )}
                    </Text>
                    <FlatList
                        data={workouts}
                        renderItem={({item, index}) => (
                            <WorkoutComponent
                                key={index}
                                workoutId={item._id}
                                machineId={item.machineId}
                                machineName={machineIdToName(item.machineId)}
                                handleDelete={removeWorkout}
                                sessionId={sessions?._id}
                                sets={item.sets}
                            />
                        )}
                        ListEmptyComponent={<Empty />}
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                    />
                    <View className="absolute bottom-4 left-0 right-0 items-center mb-4">
                        <Pressable
                            onPress={endSession}
                            className="bg-red-100 px-9 py-3 rounded-full active:opacity-60 transition-all duration-300"
                            style={{backgroundColor: "#FF3B30"}}
                        >
                            <Text className="text-base text-white font-semibold text-center">
                                End
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}
