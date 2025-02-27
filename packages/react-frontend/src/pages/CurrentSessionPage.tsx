import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Workout, Session } from "../types/sessionTypes"
import { fetchGetWorkouts, fetchPostWorkout } from "../fetchers/workoutFetchers";

// HARDCODED USER
const USER_EMAIL = "test1@gmail.com";

import WorkoutForm from "../components/workoutForm"
function CurrentPage() 
{
    // Current page stores a bunch of workouts
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [user, setUser] = useState([]);

    // Reloads the workouts once
    useEffect(() => {
        fetchGetWorkouts()
        .then((res) => res.json())
        .then((json) => setWorkouts(json))
        .catch((error: unknown) => console.log(error));
    }, []);

    function addWorkout(): void {
        setWorkouts([...workouts, newWorkout])
    }


    return (
        <>
            <WorkoutForm />
            <button onClick={addWorkout}>Add Workout</button>
            <Link to="/Machine">
                <button variant="outlined">
                        Go to Machine Page
                </button>
            </Link>
        </>
    );
}

export default CurrentPage;
