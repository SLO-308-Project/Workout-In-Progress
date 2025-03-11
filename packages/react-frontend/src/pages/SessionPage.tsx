import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import SessionTable from "../components/sessionTable";
import SessionStartButton from "../components/sessionNewSessionButton";
import {
    fetchGetSessions,
    fetchDeleteSession,
    fetchStartSessions,
} from "../fetchers/sessionFetchers";
import {Session} from "../types/sessionTypes";

function SessionPage()
{
    const [sessions, setSessions] = useState<Session[]>([]);

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
        const minutes = Math.floor((milliseconds % 3600) / 60 / 1000);
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
                const sortedSessions = [...data].sort(
                    (sessionA, sessionB) =>
                        new Date(sessionB.date).getTime() -
                        new Date(sessionA.date).getTime(),
                );
                setSessions(sortedSessions);
            })
            .catch((error: unknown) => console.log(error));
    }

    useEffect(() =>
    {
        loadSessions();
    }, []);

    // Function to delete a session
    // Will refresh session list if successful
    function deleteSession(id: string): void
    {
        fetchDeleteSession(id)
            .then((res) =>
            {
                if (res.status === 204)
                {
                    loadSessions();
                }
            })
            .catch((error: unknown) =>
            {
                console.log("Error deleting session:", error);
            });
    }

    function startSession(): void
    {
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
                console.log("Error starting session: ", err);
            });
    }

    return (
        <div className="container">
            <div className="title">
                <h2>Sessions</h2>
                <Link to="/CurrentSession">
                    <SessionStartButton createSession={startSession} />
                </Link>
            </div>
            <SessionTable
                sessionData={sessions}
                formatDate={formatDate}
                formatDuration={formatDuration}
                deleteSession={deleteSession}
            />

            <Link to="/CurrentSession">
                <button variant="outlined">Go to Current Session Page</button>
            </Link>
            <Link to="/Machine">
                <button variant="outlined">Go to Machines Page</button>
            </Link>
        </div>
    );
}

export default SessionPage;
