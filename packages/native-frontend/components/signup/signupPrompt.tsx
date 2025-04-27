import {useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";

export default function signupPrompt({handleSignUp}: Props)
{
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
                style={{lineHeight: 16}}
                autoCapitalize="none"
            />
            <TextInput
                onChangeText={(text) => setEmail(text.trim())}
                placeholder="Email"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{lineHeight: 16}}
                autoCapitalize="none"
            />
            <TextInput
                onChangeText={(text) => setUserName(text.trim())}
                placeholder="password"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{lineHeight: 16}}
                autoCapitalize="none"
            />
            <Text>Password must be at least 11 characters</Text>
            <Pressable onPress={}>
                <Text>Sign Up</Text>
            </Pressable>
        </View>
    );
}
