import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
    handleSignUp: (userName: string, email: string, password: string) => void;
    emailExists: boolean;
}

export default function signupPrompt({handleSignUp, emailExists}: Props) {
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <View>
            <TextInput 
                onChangeText={(text) => setUserName(text.trim())}
                placeholder="userName"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{ lineHeight: 16}}
                autoCapitalize="none"
            />
            <TextInput
                onChangeText={(text) => setEmail(text.trim())}
                placeholder="Email"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{ lineHeight: 16}}
                autoCapitalize="none"
            />
            <TextInput
                onChangeText={(text) => setPassword(text)}
                placeholder="password"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{ lineHeight: 16}}
                autoCapitalize="none"
            />
            <Text>Password must be at least 11 characters</Text>
            {
                emailExists && 
                <Text>User already exists with that email</Text>
            }
            <Pressable
                onPress={() => handleSignUp(userName, email, password)}
            >
                <Text>Sign Up</Text>
            </Pressable>
        </View>
    )
}