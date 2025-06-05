import {View, Text, Pressable, FlatList} from "react-native";
import {useRef, useState, useEffect, useCallback} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useIsFocused} from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useRouter, useLocalSearchParams} from "expo-router";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from "react-native-reanimated";

import {Session} from "@/types/session";
import {Workout} from "@/types/workout";
import {AttributeValue} from "@/types/attributeValue";
import {Set} from "@/types/set";

import WorkoutComponent, {
    Empty,
} from "@/components/currSession/workoutComponent";

import {
    fetchPostWorkout,
    fetchDeleteWorkout,
    fetchPostSet,
    fetchDeleteSet,
} from "@/fetchers/workoutFetchers";
import WorkoutSlide from "@/components/currSession/workoutSetsSlide";

import {
    fetchStartSessions,
    fetchEndSession,
    fetchCurrentSession,
} from "@/fetchers/currentSessionFetchers";
import {useMachineContext} from "@/util/machineContext";
import {useTemplateContext} from "@/util/templateContext";
import {Template} from "@/types/template";
import StartCurrentSession from "@/components/currSession/StartCurrentSession";
import {useCurrentSessionStatusContext} from "@/util/currentSessionContext";
import {fetchPatchSession} from "@/fetchers/sessionFetchers";
import SaveAsTemplate from "@/components/templates/SaveAsTemplate";
import {Feather} from "@expo/vector-icons";

// Configure logger to disable warning due to clock
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
});

// NOTE: Because we want an updating clock, this page will re-render once every 1000ms.
// Note that
const clockSpeed = 1000;

export default function CurrentSessionPage()
{
    //Parameters passed for starting a session.
    //  startTemplate_id is the id|undefined for the template used to start the session.
    //
    const {startTemplate_id} = useLocalSearchParams();
    const {currentSessionStatus, setCurrentSessionStatus} =
        useCurrentSessionStatusContext();
    //All of the user's machines and templates.
    const {machines} = useMachineContext();
    const {templates} = useTemplateContext();
    //current session is the session being modified and used undefined if there is no current session.
    //Template is the template being used. undefined if not used.
    const [session, setSession] = useState<Session | undefined>(undefined);
    const [template, setTemplate] = useState<Template | undefined>(undefined);
    //Updating is a boolean used to render the time every second.
    const [updating, setUpdating] = useState<boolean>(false);

    const isFocused = useIsFocused();
    const router = useRouter();

    // Receives machineId passed from workout select
    let {machineId} = useLocalSearchParams<{machineId?: string}>();

    // State for Workout Bototm Sheet Modal
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(
        null,
    );

    // Called when a workout card is tapped
    const handleOpenSheet = useCallback((workout: Workout) =>
    {
        setSelectedWorkout(workout); // Set the workout to be rendered
        bottomSheetModalRef.current?.present(); // Render the selected workout's card
    }, []);

    // used to add machines to session.
    useEffect(() =>
    {
        if (machineId !== "undefined" && machineId)
        {
            addWorkout(machineId);
        }
    }, [machineId]);

    //retrieves the current session on reload.
    //Starts a session if currentSessionStatus = 2
    //currentSessionStatus should assume 1 so it can check set to 0 if there is no session.
    useEffect(() =>
    {
        if (isFocused)
        {
            getCurrentSession().then((gottenSession) =>
            {
                //Whether a session was recovered or not. setup template.
                const foundTemplate = setupTemplate(gottenSession);
                //No Current Session
                if (gottenSession === undefined && currentSessionStatus === 2)
                {
                    startSession().then((startedSession) =>
                    {
                        loadTemplate(startedSession, foundTemplate);
                    });
                    setCurrentSessionStatus(1);
                }
                //got a Current Session then it should already be setup.
            });
        }
    }, [isFocused, currentSessionStatus]);

    // Getting workouts is triggered whenever the current session is updated
    useEffect(() =>
    {
        if (session !== null && isFocused)
        {
            // getWorkouts(session);
            const interval = setInterval(() =>
            {
                setUpdating(updating ? false : true);
            }, clockSpeed);

            return () => clearInterval(interval);
        }
    }, [isFocused, session, updating]);

    // Helper function for duration formatting
    // Converts database time which is stored in seconds to hours and minutes
    function formatDuration(milliseconds: number): string
    {
        const hours = Math.floor(milliseconds / 3600 / 1000);
        const minutes = Math.floor((milliseconds / 60 / 1000) % 60);
        const second = Math.floor((milliseconds / 1000) % 60);
        return `${hours}h ${minutes}m ${second}s`;
    }

    //helps keep all information within session.
    function setWorkouts(newWorkouts: Workout[])
    {
        if (session?.workout)
        {
            session.workout = newWorkouts;
        }
        setSession(session);
    }

    //----- SETUP/START FUNCTIONS -----

    //Sets the template variable to the correctly for the current session.
    //returns true if there was a template and false for no template.
    function setupTemplate(sess: Session | undefined)
    {
        var foundTemplate = undefined;
        //if there is a current session and template.
        if (sess !== undefined && sess.templateId !== undefined)
        {
            foundTemplate = templates.find((t) => t._id === sess.templateId);
            setTemplate(foundTemplate);
        }
        //otherwise there might be a startTemplate.
        else if (startTemplate_id !== undefined)
        {
            foundTemplate = templates.find((t) => t._id === startTemplate_id);
            setTemplate(foundTemplate);
        }
        //Else there is no template and keep startTemplate null.
        return foundTemplate;
    }

    function loadTemplate(sess: Session, temp: Template | undefined)
    {
        if (temp === undefined)
        {
            return;
        }
        const patchSession = {
            _id: sess._id,
            date: sess.date,
            templateId: temp._id,
            time: sess.time,
            workout: temp.workout,
        };
        fetchPatchSession(patchSession)
            .then((res) =>
            {
                if (res.ok)
                {
                    return res.json();
                }
            })
            .then((res_data: Session) =>
            {
                setSession(res_data);
            })
            .catch((err) =>
            {
                throw new Error(`Error PatchSession: ${err}`);
            });
    }

    //Creates a blank session on the backend.
    function startSession(): Promise<Session>
    {
        if (session !== undefined)
        {
            throw new Error("Cannot start session. Session in Progress.");
        }
        else
        {
            return fetchStartSessions()
                .then((res) =>
                {
                    if (res.status === 201)
                    {
                        return res.json();
                    }
                    else
                    {
                        throw new Error("Nothing Found");
                    }
                })
                .then((json: Session) =>
                {
                    setSession(json);
                    return json;
                })
                .catch((err: unknown) =>
                {
                    throw new Error(`Error starting session: ${err}`);
                });
        }
    }

    /*
     * Dispatches the request to get the current session, sets the current session.
     * */
    function getCurrentSession(): Promise<Session | undefined>
    {
        return fetchCurrentSession()
            .then((res) =>
            {
                if (res.status === 200)
                {
                    return res.json();
                }
                else if (res.status === 204)
                {
                    return undefined;
                    return null;
                }
            })
            .then((json: Session[]) =>
            {
                if (json === undefined)
                {
                    setSession(json);
                    return json;
                }
                else
                {
                    setSession(json[0]);
                    return json[0];
                }
            })
            .catch((err: unknown) =>
            {
                throw new Error(`Error getting current session: ${err}`);
            });
    }

    // ----- END OF SESSION FUNCTIONS -----

    // saves the session that is in the DB.
    function endSession(): void
    {
        //session already ended.
        if (session === undefined)
        {
            return;
        }
        fetchPatchSession(session).then((res) =>
        {
            if (res.ok)
            {
                fetchEndSession(session._id)
                    .then((res) =>
                    {
                        if (res.status === 201)
                        {
                            setSession(undefined);
                            setCurrentSessionStatus(0);
                        }
                        else
                        {
                            throw new Error(`No session found`);
                        }
                    })
                    .catch((err: unknown) =>
                    {
                        throw new Error(`Error ending session: ${err}`);
                    });
            }
            else
            {
                throw new Error(
                    `Something Went Wrong with Ending Session patch.`,
                );
            }
        });
    }

    function addWorkout(machineId: string): void
    {
        if (session === null)
        {
            throw new Error("Could not get session. Session does not exist.");
        }
        if (session && machineId)
        {
            fetchPostWorkout(session._id, machineId)
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
                .catch((error: unknown) =>
                    console.log(`Backend Threw: ${error}`),
                );
        }
    }

    function removeWorkout(workoutId: string): void
    {
        if (session && workoutId)
        {
            fetchDeleteWorkout(session._id, workoutId)
                .then((res) =>
                {
                    if (res.ok)
                    {
                        const new_workouts = session.workout.filter(
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

    function addSet(
        workoutId: string | undefined,
        attributeValues: AttributeValue[],
    ): Promise<Set | undefined>
    {
        if (!session)
        {
            throw new Error("Can't find a session to add set to.");
        }

        for (const attributeValue of attributeValues)
        {
            if (attributeValue.value === -1)
            {
                console.log("Attempted to add set with missing value(s)");
                return Promise.resolve(undefined);
            }
        }
        return fetchPostSet(
            session._id,
            workoutId ? workoutId : "",
            attributeValues,
        )
            .then((res) =>
            {
                if (res.ok)
                {
                    return res.text();
                }
            })
            .then((dbSetId) =>
            {
                if (!dbSetId)
                {
                    throw new Error(
                        "Database successfully updated but didnt return set id.",
                    );
                }
                const newSet: Set = {
                    _id: dbSetId,
                    attributeValues: attributeValues,
                };
                // Add the set to the workout locally
                setWorkouts(
                    session.workout.map((oldWorkout) =>
                        oldWorkout._id === workoutId
                            ? {
                                  ...oldWorkout,
                                  sets: [...oldWorkout.sets, newSet],
                              }
                            : oldWorkout,
                    ),
                );
                return newSet;
            })
            .catch((error: unknown) =>
            {
                console.log(error);
                return undefined;
            });
    }

    function deleteSet(
        workoutId: string,
        setId: string,
    ): Promise<boolean | undefined>
    {
        if (!session)
        {
            throw new Error("Can't find a session to delete set.");
        }

        return fetchDeleteSet(session._id, workoutId, setId)
            .then((res) =>
            {
                if (res.ok)
                {
                    // Remove the set from the workout locally
                    setWorkouts(
                        session.workout.map((oldWorkout) =>
                            oldWorkout._id === workoutId
                                ? {
                                      ...oldWorkout,
                                      sets: [
                                          ...oldWorkout.sets.filter(
                                              (set) => set._id !== setId,
                                          ),
                                      ],
                                  }
                                : oldWorkout,
                        ),
                    );
                    return true;
                }
            })
            .catch((error: unknown) =>
            {
                console.log(error);
                return false;
            });
    }

    function machineIdToMachine(machineId: string | undefined)
    {
        if (machines)
        {
            var matches = machines.filter((machine) =>
            {
                return machine._id.toString() === machineId;
            });
            if (template !== undefined)
            {
                matches = matches.concat(
                    template.machines.filter((machine) =>
                    {
                        return machine._id.toString() === machineId;
                    }),
                );
            }
            return matches[0];
        }
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
            {!session && (
                <View className="flex-1 items-center bg-white">
                    <Text className="text-3xl font-semibold text-black tracking-tight pb-48 pt-4 px-4">
                        No Active Session
                    </Text>
                    <StartCurrentSession
                        Icon={
                            <View className="bg-green-500 w-60 h-60 shadow-md rounded-full justify-center items-center active:opacity-80 transition-all duration-200">
                                <Text
                                    style={{fontSize: 24}}
                                    className="text-xl text-white font-semibold"
                                >
                                    Start Session
                                </Text>
                            </View>
                        }
                    />
                </View>
            )}
            {session && (
                <>
                    <View className="flex-row justify-between items-center px-4 pt-4">
                        <Text className="text-3xl font-semibold text-black tracking-tight">
                            Current Session
                        </Text>
                        <Pressable
                            className=""
                            onPress={() =>
                                router.push({
                                    pathname: "/selectMachine",
                                    params: {returnPath: "/(tabs)/currSession"},
                                })
                            }
                        >
                            <AntDesign name="plus" size={32} color="black" />
                        </Pressable>
                    </View>
                    <Text className="text-lg font-bold text-neutral-700 px-4">
                        {formatDuration(
                            Date.now() - new Date(session!.date).getTime(),
                        )}
                    </Text>
                    <FlatList
                        data={session.workout}
                        renderItem={({item, index}) => (
                            <WorkoutComponent
                                onPress={() =>
                                {
                                    handleOpenSheet(item);
                                }}
                                key={index}
                                workoutId={item._id}
                                machine={machineIdToMachine(item.machineId)}
                                handleDelete={removeWorkout}
                                sessionId={session?._id}
                                sets={item.sets}
                            />
                        )}
                        ListEmptyComponent={<Empty />}
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                    />
                    <View className="absolute bottom-4 left-0 right-0  items-center mb-4">
                        <View className="flex-row justify-center items-center space-x-4">
                            <SaveAsTemplate
                                id={session._id}
                                fromSession={true}
                                Icon={
                                    <View className="bg-yellow-400 px-3 py-3 rounded-full">
                                        <Feather
                                            name="save"
                                            size={26}
                                            color={"white"}
                                        />
                                    </View>
                                }
                            />
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
                    </View>
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
                        <WorkoutSlide
                            sessionId={session._id}
                            machine={machineIdToMachine(
                                selectedWorkout?.machineId,
                            )}
                            workout={selectedWorkout}
                            addSet={addSet}
                            deleteSet={deleteSet}
                        />
                    </BottomSheetModal>
                </>
            )}
        </SafeAreaView>
    );
}
