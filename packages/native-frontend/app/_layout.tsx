import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/util/authHeader';

export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{
                    title: "Settings",
                    headerBackTitle: "Close"
                }}
                />
            </Stack>
        </GestureHandlerRootView>
    );
}
