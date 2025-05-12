import "@/util/authHeader";
import {Stack} from "expo-router";
import {AuthProvider} from "@/util/authContext";

export default function RootLayout()
{
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="login" options={{headerShown: false}} />
                <Stack.Screen name="signup" options={{headerShown: false}} />
                <Stack.Screen name="(tabs)" options={{headerShown: false}} />
                <Stack.Screen
                    name="settings"
                    options={{
                        title: "Settings",
                        headerBackTitle: "Close",
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}
