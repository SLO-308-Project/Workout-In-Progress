import {Text, FlatList, Pressable, View} from "react-native";
import {useState, useEffect, useRef, useCallback} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useIsFocused} from "@react-navigation/native";
import {useRouter} from "expo-router";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import {
    fetchGetSessions,
    fetchDeleteSession,
    fetchStartSessions,
    fetchCurrentSession,
} from "@/fetchers/sessionFetchers";
import {Session} from "@/types/session";
import SessionComponent, {Empty} from "@/components/sessions/sessionComponent";
import StartCurrentSession from "@/components/currSession/StartCurrentSession";
// import {fetchGetTemplates} from "@/fetchers/templateFetchers";
// import {useTemplateContext} from "@/util/templateContext";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import SessionSlide from "@/components/sessions/sessionSlide";
import {useTemplateContext} from "@/util/templateContext";
import {useMachineContext} from "@/util/machineContext";
import {Machine} from "@/types/machine";

export default function PastSessionsPage()
{
    //general Data
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currSession, setCurrSession] = useState<boolean>();
    const router = useRouter();
    //Info for sessionSlide
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );
    //Machine related data
    const {templates} = useTemplateContext();
    const {machines} = useMachineContext();
    const [allMachines, setAllMachines] = useState<Machine[]>([]);

    const isFocused = useIsFocused();

    useEffect(() =>
    {
        if (isFocused)
        {
            console.log("Before Focus setup");
            getAllMachines();
            loadSessions();
            loadCurrSession();
            console.log("after Focus setup");
        }
    }, [isFocused]);

    // Function to fetch sessions
    // Sorts data by date so that most recent is first
    function loadSessions(): void
    {
        fetchGetSessions()
            .then((res: Response) => res.json())
            .then((data: Session[]) =>
            {
                const sortedSessions = [...data].sort(
                    (sessionA, sessionB) =>
                        new Date(sessionA.date).getTime() -
                        new Date(sessionB.date).getTime(),
                );
                setSessions(sortedSessions);
            })
            .catch((error: unknown) => console.log(error));
    }

    // currSession is a boolean telling if a session is set or not.
    function loadCurrSession(): void
    {
        fetchCurrentSession()
            .then((res) =>
            {
                setCurrSession(res.status !== 204);
            })
            .catch((err) =>
            {
                console.log("Unable to find curr session", err);
            });
    }

    // Helper function for date formatting
    function formatDate(dateString: string): string
    {
        return new Date(dateString).toLocaleDateString();
    }

    // Helper function for duration formatting
    // Converts database time which is stored in seconds to hours and minutes
    function formatDuration(milliseconds: number): string
    {
        const hours = Math.floor(milliseconds / 3600 / 1000);
        const minutes = Math.floor((milliseconds / 60 / 1000) % 60);
        const second = Math.floor((milliseconds / 1000) % 60);
        return `${hours}h ${minutes}m ${second}s`;
    }

    // Helper function to convert a date to a reasonable name
    function dateToName(dateString: string): string
    {
        const date = new Date(dateString);
        const hour = date.getHours();
        const day = date.getDay();
        let name: string = "";

        if (day === 0)
        {
            name += "Sunday ";
        }
        else if (day === 1)
        {
            name += "Monday ";
        }
        else if (day === 2)
        {
            name += "Tuesday ";
        }
        else if (day === 3)
        {
            name += "Wednesday ";
        }
        else if (day === 4)
        {
            name += "Thursday ";
        }
        else if (day === 5)
        {
            name += "Friday ";
        }
        else if (day === 6)
        {
            name += "Saturday ";
        }

        if (hour < 7)
        {
            name += "Sunrise Session";
        }
        else if (hour >= 7 && hour < 12)
        {
            name += "Morning Session";
        }
        else if (hour >= 12 && hour < 17)
        {
            name += "Afternoon Session";
        }
        else if (hour >= 17 && hour < 21)
        {
            name += "Evening Session";
        }
        else if (hour >= 21)
        {
            name += "Night Session";
        }

        return name;
    }

    // Function to delete a session
    // Will refresh session list if successful
    function deleteSession(id: string): void
    {
        fetchDeleteSession(id)
            .then((res) =>
            {
                if (res.status === 204)
                {
                    setSessions(
                        sessions.filter((session: Session) =>
                        {
                            return session._id !== id;
                        }),
                    );
                }
            })
            .catch((error: unknown) =>
            {
                console.log("Error deleting session:", error);
            });
    }

    //SessionSlide Functions

    const handleOpenSheet = useCallback((session: Session) =>
    {
        setSelectedSession(session);
        bottomSheetModalRef.current?.present();
    }, []);

    function getAllMachines()
    {
        //Get all machines in an arryay.
        var tempMachineArray: Machine[] = machines;
        for (const template of templates)
        {
            tempMachineArray.push(...template.machines);
        }
        //Removing duplicates by converting to set and back.
        setAllMachines([...new Set<Machine>(tempMachineArray)]);
    }

    //Functions that navigate.

    function startSession(): void
    {
        if (currSession)
        {
            router.navigate("/(tabs)/currSession");
            return;
        }
        fetchStartSessions()
            .then((res) =>
            {
                if (res.status !== 201)
                {
                    throw new Error("No content added");
                }
                else
                {
                    router.navigate("/(tabs)/currSession");
                }
            })
            .catch((err: unknown) =>
            {
                console.log("Error creating session: ", err);
            });
    }

    const openSettingsStack = () =>
    {
        router.push("../settings");
    };

    const openStatisticsStack = () =>
    {
        router.push("../statistics");
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white pt-4">
            <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
                <Text className="text-3xl font-semibold text-black tracking-tight">
                    Your Sessions
                </Text>
                <Pressable className="" onPress={openSettingsStack}>
                    <Feather
                        className=""
                        name="settings"
                        size={34}
                        color="black"
                    />
                </Pressable>
            </View>
            <View className="flex-row justify-center py-2">
                <Pressable
                    className=" w-3/5 rounded-lg border bg-gray-100 border-gray-300 flex-row justify-center"
                    onPress={openStatisticsStack}
                >
                    <Text className="text-2xl font-semibold text-black tracking-tight py-1">
                        Statistics
                    </Text>
                </Pressable>
            </View>
            <FlatList
                data={sessions.reverse()}
                renderItem={({item, index}) => (
                    <SessionComponent
                        onPress={() => handleOpenSheet(item)}
                        key={index}
                        sessionId={item._id}
                        name={dateToName(item.date)}
                        date={formatDate(item.date)}
                        duration={formatDuration(item.time)}
                        deleteSession={deleteSession}
                        session={item}
                    />
                )}
                ListEmptyComponent={<Empty />}
                showsVerticalScrollIndicator={false}
                className="container"
            />
            <StartCurrentSession
                Icon={
                    <View className="absolute bottom-8 right-8 bg-yellow-400 p-4 rounded-full shadow-sm">
                        <AntDesign name="plus" size={32} color="white" />
                    </View>
                }
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
                <SessionSlide
                    allMachines={allMachines}
                    currentSession={selectedSession}
                    name={
                        selectedSession ? dateToName(selectedSession.date) : ""
                    }
                    date={
                        selectedSession ? formatDate(selectedSession.date) : ""
                    }
                    duration={
                        selectedSession
                            ? formatDuration(selectedSession.time)
                            : ""
                    }
                    deleteSession={deleteSession}
                />
            </BottomSheetModal>
        </SafeAreaView>
    );
}
