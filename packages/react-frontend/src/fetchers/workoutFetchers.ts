import { AttributeValue } from "../types/attributeValue";
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
        body: JSON.stringify({ machineId: `${machineId}` }),
    });
}

function fetchDeleteWorkout(session_id: string, workout_id: string): Promise<Response> {
    return fetch(`${BACKEND_URL}/workouts/${session_id}/${workout_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

function fetchPostSet(workout_id: string, attributeValues: AttributeValue[]): Promise<Response> {
    return fetch(`${BACKEND_URL}/workouts/${workout_id}/sets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(attributeValues)
    })
}

export { fetchGetWorkouts, fetchPostWorkout, fetchDeleteWorkout, fetchPostSet}
