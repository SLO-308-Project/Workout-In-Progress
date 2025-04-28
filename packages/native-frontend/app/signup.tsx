import {View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import SignupPrompt from "@/components/signup/signupPrompt";
import { fetchRegister } from "@/fetchers/userFetchers";
import { useState } from "react";

export default function signup()
{
    const [emailExists, setEmailExists] = useState(false);

    /**
     * Registers a user.
     * If user exists then sets emailExists to show message.
     * IF user doesn't exists then creates the user and logs in the user. 
     */
    function handleSignUp(userName: string, email: string, password: string)
    {
        console.log(`called handle signup: userName=${userName}, email=${email}, password=${password}`);
        fetchRegister(userName, email, password)
            .then((res: Response) => {
                if (res.ok)
                    {
                       //Implement Login and authorization externally.
                    }
                else if (res.status == 409) //User already exists. Checks by unique email.
                    {
                        setEmailExists(true);
                    }
            })
            .catch((error: Error) => {
                console.log(`fetchRegister error: ${error.message}`)
            });
    }

    return (
        <SafeAreaView
            className="flex-1 bg-white px-4 pt-4"    
            edges={["top"]}
        >
            <View
                className="items-center"
                style={{ marginTop: "20%" }}
            >
                <Text
                    className="text-4x1 font-semibold text-black tracking-tight"
                >Sign Up</Text>
            </View>
               <TouchableWithoutFeedback>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="flex-1"
                    >
                        <SignupPrompt handleSignUp={handleSignUp} emailExists={emailExists} />
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
