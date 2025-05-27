import {Text, FlatList, Pressable, View} from "react-native";
import {useState, useEffect} from "react";
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

export default function HomeScreen()
{
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currSession, setCurrSession] = useState<boolean>();
    const router = useRouter();

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

        if (hour < 6)
        {
            name += "Late Night Session";
        }
        else if (hour >= 6 && hour < 12)
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
    // Function to fetch sessions
    // Sorts data by date so that most recent is first
    function loadSessions(): void
    {
        fetchGetSessions()
            .then((res: Response) => res.json())
            .then((data: Session[]) =>
            {
                const sortedSessions = [...data]
                    .sort(
                        (sessionA, sessionB) =>
                            new Date(sessionB.date).getTime() -
                            new Date(sessionA.date).getTime(),
                    )
                    .reverse();
                setSessions(sortedSessions);
            })
            .catch((error: unknown) => console.log(error));
    }

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

    const isFocused = useIsFocused();

    useEffect(() =>
    {
        if (isFocused)
        {
            loadSessions();
            loadCurrSession();
        }
    }, [isFocused]);

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
                        size={24}
                        color="black"
                    />
                </Pressable>
            </View>
            <Pressable
                className="flex-row justify-center"
                onPress={openStatisticsStack}
            >
                <Text className="text-lg font-semibold text-black tracking-tight px-4 pt-4 pb-2">
                    Statistics
                </Text>
            </Pressable>
            <FlatList
                data={sessions.reverse()}
                renderItem={({item, index}) => (
                    <SessionComponent
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
            {/* <Pressable
                className="absolute bottom-8 right-8 bg-yellow-400 p-4 rounded-full shadow-sm"
                onPress={() => startSession()}
            >
                <View
                    className="absolute bottom-8 right-8 bg-yellow-400 p-4 rounded-full shadow-sm"
                >
                    <AntDesign name="plus" size={32} color="white" />
                </View>
            </Pressable> */}
        </SafeAreaView>
    );
}
