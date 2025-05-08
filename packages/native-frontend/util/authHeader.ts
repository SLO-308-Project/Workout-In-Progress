import AsyncStorage from "@react-native-async-storage/async-storage";

const originalFetch = global.fetch;
// Changes default fetch functionality to include auth header if jwt found
global.fetch = async (url, options = {}) =>
{
    try
    {
        const token = await AsyncStorage.getItem("jwtToken");

        if (token)
        {
            options = {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                },
            };
        }

        return originalFetch(url, options);
    }
    catch (error)
    {
        console.error("Error attaching auth header:", error);
        return originalFetch(url, options);
    }
};
