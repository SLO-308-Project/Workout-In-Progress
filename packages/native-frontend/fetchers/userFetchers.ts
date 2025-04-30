const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Calls POST to users. Creating a user in the DB. 
 */

function fetchRegister(
    userName: string | undefined,
    email: string | undefined,
    password: string | undefined,
): Promise<Response>
{
    return fetch(`${BACKEND_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: `${userName}`,
            email: `${email}`,
            password: `${password}`
        }),}
    )
}

export {
    fetchRegister,
}