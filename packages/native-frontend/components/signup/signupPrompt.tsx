import {Router} from "expo-router";
import {useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {
    validatePassword,
    validateEmail,
    validateUsername,
} from "@/util/signupValidator";

type Props = {
    handleSignUp: (userName: string, email: string, password: string) => void;
    emailExists: boolean;
    router: Router;
};

export default function SignupPrompt({
    handleSignUp,
    emailExists,
    router,
}: Props)
{
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPasswordErrors, setShowPasswordErrors] =
        useState<boolean>(false);
    const [showEmailError, setShowEmailError] = useState<boolean>(false);
    const [showUsernameError, setShowUsernameError] = useState<boolean>(false);

    const handlePasswordChange = (text: string) =>
    {
        setPassword(text);
        if (showPasswordErrors)
        {
            setShowPasswordErrors(false);
        }
    };

    const handleEmailChange = (text: string) =>
    {
        setEmail(text.trim());
        if (showEmailError)
        {
            setShowEmailError(false);
        }
    };

    const handleUsernameChange = (text: string) =>
    {
        setUserName(text.trim());
        if (showUsernameError)
        {
            setShowUsernameError(false);
        }
    };

    const handleSubmit = () =>
    {
        const usernameValidation = validateUsername(userName);
        if (!usernameValidation.isValid)
        {
            setShowUsernameError(true);
            return;
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid)
        {
            setShowEmailError(true);
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid)
        {
            setShowPasswordErrors(true);
            return;
        }

        handleSignUp(userName, email, password);
    };

    const hasMinLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return (
        <View className="w-11/12">
            <TextInput
                className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                onChangeText={handleUsernameChange}
                maxLength={20}
                placeholder="username"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{lineHeight: 16}}
                autoCapitalize="none"
            />
            <TextInput
                className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
                onChangeText={handleEmailChange}
                maxLength={254}
                placeholder="email"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{lineHeight: 16}}
                autoCapitalize="none"
            />
            <TextInput
                className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-2"
                onChangeText={handlePasswordChange}
                maxLength={128}
                placeholder="password"
                placeholderTextColor="7A7674"
                textAlignVertical="center"
                style={{lineHeight: 16}}
                secureTextEntry
                autoCapitalize="none"
            />
            <View className="w-full bg-gray-50 p-3 rounded-lg mb-4">
                <Text
                    className={`text-sm ${hasMinLength ? "text-green-600" : "text-gray-500"}`}
                >
                    {hasMinLength ? "✓" : "○"} At least 8 characters
                </Text>
                <Text
                    className={`text-sm ${hasLowercase ? "text-green-600" : "text-gray-500"}`}
                >
                    {hasLowercase ? "✓" : "○"} One lowercase letter
                </Text>
                <Text
                    className={`text-sm ${hasUppercase ? "text-green-600" : "text-gray-500"}`}
                >
                    {hasUppercase ? "✓" : "○"} One uppercase letter
                </Text>
                <Text
                    className={`text-sm ${hasNumber ? "text-green-600" : "text-gray-500"}`}
                >
                    {hasNumber ? "✓" : "○"} One number
                </Text>
            </View>
            {showUsernameError && (
                <Text className="text-red-500 text-sm text-center mb-4">
                    Username is required
                </Text>
            )}
            {showPasswordErrors && (
                <Text className="text-red-500 text-sm text-center mb-4">
                    Password does not meet requirements
                </Text>
            )}
            {showEmailError && (
                <Text className="text-red-500 text-sm text-center mb-4">
                    Please enter a valid email address
                </Text>
            )}
            {emailExists && (
                <Text className="text-red-500 text-sm text-center mb-4">
                    User already exists with that email
                </Text>
            )}
            <Pressable
                className="w-full bg-black py-3 rounded-lg items-center mb-4"
                onPress={handleSubmit}
            >
                <Text className="text-white text-base font-semibold">
                    Sign Up
                </Text>
            </Pressable>
            <View>
                <Text className="text-gray-500 text-center mb-2">
                    Already have an account?
                </Text>
                <Pressable
                    className="items-center"
                    onPress={() => router.navigate("./login")}
                >
                    <Text className="text-black font-semibold">Sign In</Text>
                </Pressable>
            </View>
        </View>
    );
}
