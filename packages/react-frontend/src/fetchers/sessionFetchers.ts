import {getEnv} from "../util/env";

const BACKEND_URL: string = getEnv("VITE_SERVER_URL");

/**
 * Executes a GET request to the backend to retrieve sessions.
 *
 * @returns {Promise} Promise returned by async fetch request
 */
function fetchGetSessions(): Promise<Response>
{
    return fetch(`${BACKEND_URL}/sessions`);
}

/**
 * Executes a DELETE request to the backend to delete the specified session.
 *
 * @param {string} id - deletes session with this id
 * @returns {Promise} Promise returned by async fetch request
 */
function fetchDeleteSession(id: string): Promise<Response>
{
    return fetch(`${BACKEND_URL}/sessions/${id}`, {
        method: "DELETE",
    });
}

/**
 * Executes a Post request to the backend to start a new session.
 *
 * @returns {Promise} Promise returned by async fetch request
 */
function fetchStartSessions(): Promise<Response>
{
    return fetch(`${BACKEND_URL}/sessions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            time: 0,
            workout: [],
        }),
    });
}

/**
 *
 */
function fetchCurrentSession(): Promise<Response>
{
    return fetch(`${BACKEND_URL}/sessions/recent`);
}

export {
    fetchGetSessions,
    fetchDeleteSession,
    fetchStartSessions,
    fetchCurrentSession,
};
