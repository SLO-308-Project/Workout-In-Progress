import "@/util/authHeader";
import {Stack} from "expo-router";
import {AuthProvider} from "@/util/authContext";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {TemplateProvider} from "@/util/templateContext";
import {MachineProvider} from "@/util/machineContext";

export default function RootLayout()
{
    return (
        <AuthProvider>
            <MachineProvider>
                <TemplateProvider>
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
                            </Stack>
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </TemplateProvider>
            </MachineProvider>
        </AuthProvider>
    );
}
