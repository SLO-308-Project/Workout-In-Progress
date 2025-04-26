import { Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LoginPrompt from "@/components/login/loginPrompt";
import { fetchLogin } from "@/fetchers/authFetchers";
import { useState } from "react";

export default function Login() {
    const [loginFailed, setLoginFailed ]= useState(false);
    function handleLogin(email: string, password: string): void {
        console.log(`called handle login: email=${email} password=${password}`);
        fetchLogin(email, password)
            .then((res: Response) => {
                if (res.ok) {
                    console.log(`Authorized.`);
                    return res.text();
                } else {
                    setLoginFailed(true);
                    throw new Error("Login failed.")
                }
            })
            .then((res_data) => {
                // NOTE: login token is being retrieved, but not being stored anywhere yet for protected routing
                console.log((`auth token: ${res_data}`));
            })
            .catch((error: Error) => {
                console.log(`fetchLogin err: ${error.message}`);
            })
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white px-4 pt-4">
            <View
                className="container"
            >
                <Text className="text-3xl font-semibold text-black tracking-tight pt-4">
                    Login
                </Text>
                <LoginPrompt handleSubmit={handleLogin} loginFailed={loginFailed}/>
            </View>
        </SafeAreaView>
    )

}
