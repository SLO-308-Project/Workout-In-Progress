import {Text, ScrollView} from "react-native";
import {useState, useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useIsFocused} from "@react-navigation/native";

import {
    fetchGetSessions,
    fetchDeleteSession,
    fetchStartSessions,
    fetchCurrentSession,
} from "@/fetchers/sessionFetchers";
import {Session} from "@/types/session";
import SessionComponent from "@/components/sessions/sessionComponent";

export default function HomeScreen()
{
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currSession, setCurrSession] = useState<boolean>();

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
            return;
        }
        fetchStartSessions()
            .then((res) =>
            {
                if (res.status !== 201)
                {
                    throw new Error("No content added");
                }
            })
            .catch((err: unknown) =>
            {
                console.log("Error creating session: ", err);
            });
    }

    const listSessions = sessions.map((session: Session, idx: number) => (
        <SessionComponent
            key={idx}
            name={idx + 1}
            date={formatDate(session.date)}
            duration={formatDuration(session.time)}
            deleteSession={deleteSession}
            session={session}
        />
    ));

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white pt-4">
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="container"
            >
                <Text className="text-3xl font-semibold text-black tracking-tight px-4 pt-4">
                    Your Sessions
                </Text>
                {listSessions}
            </ScrollView>
        </SafeAreaView>
    );
}
