import Constants from "expo-constants";
const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

function fetchLogin(email: string, password: string): Promise<Response>
{
    return fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export {fetchLogin};
