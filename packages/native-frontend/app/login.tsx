import { Text, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LoginPrompt from "@/components/login/loginPrompt";
// import { fetchLogin } from "@/fetchers/authFetchers";
import { useState } from "react";
import { Redirect } from "expo-router";
import { login } from '@/util/loginHelper';

export default function Login() {
    // const [loginFailed, setLoginFailed] = useState(false);
    const [loggedIn, setLoggedIn] = useState<boolean>();
    function handleLogin(email: string, password: string): void {
        login(email, password)
            .then((result: boolean) => {
                setLoggedIn(result);
            })
            
    }
    if (loggedIn) {
        return (<Redirect href="/(tabs)" />)
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white px-4 pt-4">
            <View className="items-center" style={{ marginTop: '20%' }}>
                <Text className="text-4xl font-semibold text-black tracking-tight">
                    Workout In Progress
                </Text>
            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <View className="flex-1 justify-center items-center">
                        <LoginPrompt handleSubmit={handleLogin} loggedIn={loggedIn} />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )

}
