import {getEnv} from "../util/env";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Executes a get request to the backend to get a specific session
 *
 * @returns {Promise} Promise returned by async fetch request
 */
function fetchGetSession(id: string): Promise<Response>
{
    return fetch(`${BACKEND_URL}/sessions/${id}`);
}

/**
 *
 */
function fetchCurrentSession(): Promise<Response>
{
    return fetch(`${BACKEND_URL}/sessions/recent`);
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
 * Executes a put request to the backend to end the current session
 *
 * @param {string} id - updates session with this id
 * @returns {Promise} Promise returned by async fetch request
 */
function fetchEndSession(id: string): Promise<Response>
{
    return fetch(`${BACKEND_URL}/sessions/${id}`, {
        method: "PUT",
    });
}

/**
 * Executes a GET request to the backend to retrieve sessions.
 *
 * @returns {Promise} Promise returned by async fetch request
 */
function fetchGetSessions(): Promise<Response>
{
    return fetch(`${BACKEND_URL}/sessions`);
}

export {
    fetchStartSessions,
    fetchEndSession,
    fetchGetSession,
    fetchCurrentSession,
    fetchGetSessions,
};
