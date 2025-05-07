
// const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || "https://workoutinprogressapi-fhdwaeeafkayegcw.westus-01.azurewebsites.net";

function getEnv(name: string)
{
    const value = import.meta.env[name];
    if (!value)
    {
        throw new Error(`Environment variable ${name} is not set.`);
    }
    return value;
}

export {
    getEnv,
    // BACKEND_URL
}