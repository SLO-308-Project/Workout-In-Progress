import {AttributeValue} from "../types/attributeValue";

import Constants from "expo-constants";
const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

/**
 * Executes a GET request to get the workouts for a given session id
 * */
function fetchGetWorkouts(session_id: string): Promise<Response>
{
    return fetch(`${BACKEND_URL}/workouts/${session_id}`);
}

function fetchPostWorkout(
    session_id: string,
    machineId: string,
): Promise<Response>
{
    return fetch(`${BACKEND_URL}/workouts/${session_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({machineId: `${machineId}`}),
    });
}

function fetchDeleteWorkout(
    session_id: string,
    workout_id: string,
): Promise<Response>
{
    return fetch(`${BACKEND_URL}/workouts/${session_id}/${workout_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

function fetchPostSet(
    session_id: string,
    workout_id: string,
    attributeValues: AttributeValue[],
): Promise<Response>
{
    return fetch(`${BACKEND_URL}/workouts/${session_id}/${workout_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({attributeValues}),
    });
}

function fetchDeleteSet(
    session_id: string,
    workout_id: string,
    set_id: string,
): Promise<Response>
{
    return fetch(
        `${BACKEND_URL}/workouts/${session_id}/${workout_id}/${set_id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
}

export {
    fetchGetWorkouts,
    fetchPostWorkout,
    fetchDeleteWorkout,
    fetchPostSet,
    fetchDeleteSet,
};
