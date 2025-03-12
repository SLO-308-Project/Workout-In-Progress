import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import CurrentSessionStartButton from "../components/currentSessionEnd";
import CurrentSessionEndButton from "../components/currentSessionStart";
import {Machine, Session} from "../types/sessionTypes";
import {
    fetchGetWorkouts,
    fetchPostWorkout,
    fetchDeleteWorkout,
} from "../fetchers/workoutFetchers";
import {fetchGetMachine} from "../fetchers/machineFetchers";
import {
    fetchStartSessions,
    fetchEndSession,
    fetchCurrentSession,
    fetchGetSessions,
} from "../fetchers/currentSessionFetchers";
import WorkoutForm from "../components/workoutForm";
import CurrentSessionTable from "../components/currentSessionTable";
const clockSpeed = 200;

function CurrentSessionPage()
{
    const [sessions, setSessions] = useState<Session | null>(null);
    const [sessionNum, setSessionNum] = useState<number | null>(null);
    const [time, setTime] = useState(0);
    const [workouts, setWorkouts] = useState<Machine[]>([]);

    // State for the users currently selected machine
    const [machines, setMachines] = useState([]);

    useEffect(() =>
    {
        setInterval(() =>
        {
            setTime((time) => time + clockSpeed / 1000);
        }, clockSpeed);
        getMachines();
        getCurrentSession();
        getSessionNumber();
    }, []);

    // Getting workouts is triggered whenever the current session is updated
    useEffect(() =>
    {
        if (sessions !== null)
        {
            getWorkouts(sessions);
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
        //console.log(sessions);
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
                    //throw new Error("Got a 204 from fetch");
                }
            })
            .then((json: Session[]) =>
            {
                if (json === null)
                {
                    console.log("No values");
                    //throw new Error("No current session?");
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
                if (res.status == 201)
                {
                    return res.json();
                }
                else
                {
                    throw new Error("Failed to get workouts");
                }
            })
            .then((json) =>
            {
                setWorkouts(json);
            });
    }

    function addWorkout(machineId: string): void
    {
        if (sessions === null)
        {
            throw new Error("Could not get session. Session does not exist.");
        }
        console.log("trying to add a workout");
        if (sessions && machineId)
        {
            fetchPostWorkout(sessions._id, machineId)
                .then((res) =>
                {
                    if (res.ok)
                    {
                        return res.json();
                    }
                    else
                    {
                        throw new Error();
                    }
                })
                .then((res_data) =>
                {
                    setWorkouts([
                        ...workouts,
                        {machineId: machineId, sets: [], _id: res_data._id},
                    ]);
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

    return (
        <div className="container">
            <CurrentSessionStartButton
                sessionNum={sessionNum}
                sessionData={sessions}
                createSession={startSession}
            />
            <CurrentSessionEndButton endSession={endSession} />

            <CurrentSessionTable
                workoutData={workouts}
                machineOptions={machines}
                handleDelete={removeWorkout}
            />
            <WorkoutForm handleSubmit={addWorkout} machineOptions={machines} />

            <Link to="/Machine">
                <button>Go to Machine Page</button>
            </Link>
            <Link to="/Sessions">
                <button>Go to Sessions Page</button>
            </Link>
        </div>
    );
}

export default CurrentSessionPage;
