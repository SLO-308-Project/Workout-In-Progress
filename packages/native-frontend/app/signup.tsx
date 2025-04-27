import {View, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import SignupPrompt from "@/components/signup/signupPrompt";
import { fetchRegister } from "@/fetchers/userFetchers";

export default function signup()
{
    function handleSignUp(userName: string, email: string, password: string)
    {
        console.log(`called handle signup: userName=${userName}, email=${email}, password=${password}`) 
        
    }

    return (
        <SafeAreaView>
            <View>
                <Text>Sign Up</Text>
            </View>
            <SignupPrompt handleSignUp={handleSignUp} />
        </SafeAreaView>
    );
}
