const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export function fetchLogin(
    email: string,
    password: string,
): Promise<Response> {
    return fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password
        }),
    });
}
