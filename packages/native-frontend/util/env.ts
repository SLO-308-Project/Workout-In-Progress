export function getEnv(name: string)
{
    const value = import.meta.env[name];
    if (!value)
    {
        throw new Error(`Environment variable ${name} is not set.`);
    }
    return value;
}
