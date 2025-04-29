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
        <View className="w-11/12">
            <TextInput 
                className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                onChangeText={(text) => setUserName(text.trim())}
                placeholder="username"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{ lineHeight: 16}}
                autoCapitalize="none"
            />
            <TextInput
                className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                onChangeText={(text) => setEmail(text.trim())}
                placeholder="email"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{ lineHeight: 16}}
                autoCapitalize="none"
            />
            <TextInput
                className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-6"
                onChangeText={(text) => setPassword(text)}
                placeholder="password"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{ lineHeight: 16}}
                autoCapitalize="none"
            />
            <Text
                className="w-full text-gray-500 py-3 rounded-lg text-center mb-4"
            >Password must be at least 11 characters</Text>
            {
                emailExists && 
                <Text
                    className="text-red-500 text-sm text-center mb-4"
                >User already exists with that email</Text>
            }
            <Pressable
                className="w-full bg-black py-3 rounded-lg items-center mb-4"
                onPress={() => handleSignUp(userName, email, password)}
            >
                <Text
                    className="text-white text-base font-semibold"    
                >Sign Up</Text>
            </Pressable>
        </View>
    )
}