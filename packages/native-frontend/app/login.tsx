import {
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import LoginPrompt from "@/components/login/loginPrompt";
import {fetchLogin} from "@/fetchers/authFetchers";
import {useState} from "react";
import {Redirect} from "expo-router";

export default function Login()
{
    const [loginFailed, setLoginFailed] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
<<<<<<< HEAD
    function handleLogin(email: string, password: string): void
    {
        console.log(`called handle login: email=${email} password=${password}`);
=======
    function handleLogin(email: string, password: string): void {
>>>>>>> 0bfcf1ae2be35b8abe698bc27f37402a5d541ccd
        fetchLogin(email, password)
            .then((res: Response) =>
            {
                if (res.ok)
                {
                    console.log(`Authorized.`);
                    return res.text();
                }
                else
                {
                    setLoginFailed(true);
                    throw new Error("Login failed.");
                }
            })
            .then((res_data) =>
            {
                // NOTE: login token is being retrieved, but not being stored anywhere yet for protected routing
                console.log(`auth token: ${res_data}`);
                setLoggedIn(true);
            })
            .catch((error: Error) =>
            {
                console.log(`fetchLogin err: ${error.message}`);
            });
    }
    if (loggedIn)
    {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white px-4 pt-4">
            <View className="items-center" style={{marginTop: "20%"}}>
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
                        <LoginPrompt
                            handleSubmit={handleLogin}
                            loginFailed={loginFailed}
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
