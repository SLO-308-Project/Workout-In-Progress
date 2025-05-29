import "@/util/authHeader";
import {Stack} from "expo-router";
import {AuthProvider} from "@/util/authContext";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

export default function RootLayout()
{
    return (
        <AuthProvider>
            <GestureHandlerRootView>
                <BottomSheetModalProvider>
                    <Stack>
                        <Stack.Screen
                            name="login"
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="signup"
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="(tabs)"
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="settings"
                            options={{
                                title: "Settings",
                                headerBackTitle: "Close",
                            }}
                        />
                        <Stack.Screen
                            name="newMachine"
                            options={{
                                title: "New Machine",
                                headerBackTitle: "Back",
                            }}
                        />
                        <Stack.Screen
                            name="selectMachine"
                            options={{
                                title: "Select Machine",
                                headerBackTitle: "Back",
                                contentStyle: {paddingTop: 0},
                            }}
                        />
                    </Stack>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </AuthProvider>
    );
}
