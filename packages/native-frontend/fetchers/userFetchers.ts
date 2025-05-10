import Constants from "expo-constants";
const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

/**
 * Calls POST to users. Creating a user in the DB.
 */

function fetchRegister(
    userName: string | undefined,
    email: string | undefined,
    password: string | undefined,
): Promise<Response>
{
    // return fetch(`/users/register`, {
    return fetch(`${BACKEND_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: `${userName}`,
            email: `${email}`,
            password: `${password}`,
        }),
    });
}

export {fetchRegister};
