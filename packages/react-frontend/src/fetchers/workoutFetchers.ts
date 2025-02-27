const BACKEND_URL: string = "http://localhost:8000";

/**
 * Executes a GET request to get the workouts for a given session id
 * */
function fetchGetWorkouts(session_id: string): Promise<Response> {
    return fetch(`${BACKEND_URL}/workouts/${session_id}`);
}

function fetchPostWorkout(session_id: string, machineId: string): Promise<Response> {
    return fetch(`${BACKEND_URL}/workouts/${session_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({machineId: `${machineId}`}),
    });
}

export {fetchGetWorkouts, fetchPostWorkout}
