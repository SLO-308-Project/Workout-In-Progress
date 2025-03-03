import { getEnv } from "../util/env";

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

export {fetchGetSessions, fetchDeleteSession};
