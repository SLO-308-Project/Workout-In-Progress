import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import CurrentSessionStartButton from "../components/currentSessionEnd";
import CurrentSessionEndButton from "../components/currentSessionStart";
import {Session} from "../types/sessionTypes";
import { Workout, Session } from "../types/sessionTypes"
import { fetchGetWorkouts, fetchPostWorkout } from "../fetchers/workoutFetchers";
import { 
    fetchStartSessions, 
    fetchEndSession, 
    fetchCurrentSession, 
    fetchGetSessions 
} from "../fetchers/currentSessionFetchers";
import WorkoutForm from "../components/workoutForm"
const clockSpeed = 200;
// HARDCODED USER
const USER_EMAIL = "test1@gmail.com";

function CurrentSessionPage() {
    const [sessions, setSessions] = useState<Session | null>(null);
    const [sessionNum, setSessionNum] = useState<number | null>(null);
    const [time, setTime] = useState(0);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [user, setUser] = useState([]);

    useEffect(() => {
        setInterval(()=>{setTime(time => time + clockSpeed/1000)}, clockSpeed);
        getCurrentSession();
        getSessionNumber();
        getWorkouts();
    }, [])

    function startSession(): void {
        if (sessions !== null) {
            return;
        }
        fetchStartSessions()
            .then((res) => {
                if (res.status === 201) {
                    return res.json()
                } else {
                    throw new Error("No content added");
                }
            })
            .then((json: Session) => {
                setSessions(json);
                setSessionNum(sessionNum! + 1);
            })
            .catch((err: unknown) => {
                console.log("Error starting session: ", err);
            })
    }

    function endSession(): void {
        //console.log(sessions);
        if (sessions === null) {
            return;
        }
        fetchEndSession(sessions._id)
            .then((res) => {
                if (res.status === 201) {
                    setSessions(null);
                } else {
                    throw new Error("No session found");
                }
            })
            .catch((err: unknown) => {
                console.log("Error ending session: ", err);
            })
    }

    function getCurrentSession(): void {
        fetchCurrentSession()
            .then((res) => {
                if (res.status === 200) {  
                    console.log("200");
                    return res.json();
                } else if (res.status === 204) {
                    console.log("204");
                    return null;
                }
            })
            .then((json: Session[]) => {
                if (json === null) {
                    console.log("No values");
                } else {
                    setSessions(json[0]);
                }
            })
            .catch((err: unknown) => {
                console.log("Error getting current session: ", err);
            })
    }

    function getSessionNumber(): void {
        fetchGetSessions()
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error("No sessions found");
                }
            })
            .then((json: Session[]) => {
                setSessionNum(json.length);
            })
            .catch((err: unknown) => {
                console.log("Error getting session number ", err);
            })
    }

    function getWorkouts(): void {
        fetchGetWorkouts()
        .then((res) => {
                if (res.status === 200) {
                    return res.json();
                }
                else {
                    throw new Error("No workouts found");
                }
            })
        .then((json) => setWorkouts(json))
        .catch((error: unknown) => console.log(error));
    }

    return <div className="container">
        <CurrentSessionStartButton 
            sessionNum={sessionNum}
            sessionData={sessions}
            createSession={startSession}
        />
        <CurrentSessionEndButton 
            endSession={endSession}
        />
        <Link to="/Machine">
            <button variant="outlined">
                    Go to Machine Page
            </button>
        </Link>
    </div>
}

export default CurrentSessionPage;
