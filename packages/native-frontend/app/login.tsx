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
// import { fetchLogin } from "@/fetchers/authFetchers";
import {useState, useEffect} from "react";
import {Redirect} from "expo-router";
import {useAuth} from "@/util/authContext";

export default function Login()
{
    const [loginFailed, setLoginFailed] = useState(false);
    const {login, isAuthenticated, isLoading} = useAuth();

    useEffect(() =>
    {
        setLoginFailed(false);
    }, []);

    async function handleLogin(email: string, password: string): Promise<void>
    {
        setLoginFailed(false);
        const success = await login(email, password);
        if (!success)
        {
            setLoginFailed(true);
        }
    }

    if (isAuthenticated && !isLoading)
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
            <TouchableWithoutFeedback>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <View className="flex-1 justify-center items-center">
                        <LoginPrompt
                            handleSubmit={handleLogin}
                            loggedIn={loginFailed ? false : undefined}
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
