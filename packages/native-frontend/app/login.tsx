import { Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LoginPrompt from "@/components/login/loginPrompt";
import { fetchLogin } from "@/fetchers/authFetchers";

export default function Login() {
    function handleLogin(email: string, password: string): void {
        console.log(`called handle login: email=${email} password=${password}`);
        fetchLogin(email, password)
        .then((res: Response) => res.json())
        .then((res_data: JSON) => {
                console.log((res_data));
            })
        .catch((error: Error) => console.log(error.message))
    } 

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white px-4 pt-4">
            <View
                className="container"
            >
                <Text className="text-3xl font-semibold text-black tracking-tight pt-4">
                    Login
                </Text>
                <LoginPrompt handleSubmit={handleLogin}/>
            </View>
        </SafeAreaView>
    )

}
