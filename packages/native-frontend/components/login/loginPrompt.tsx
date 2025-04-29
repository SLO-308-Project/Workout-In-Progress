import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';

type Props = {
	handleSubmit: (email: string, password: string) => void;
	loggedIn: boolean | undefined;
}

export default function LoginPrompt({ handleSubmit, loggedIn }: Props) {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	return (
		<View className="w-full">
			<TextInput
				className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-4"
				onChangeText={(text) => setEmail(text.trim())}
				placeholder="Email"
				placeholderTextColor="#9CA3AF" // lighter muted gray
				textAlignVertical="center"
				style={{ lineHeight: 16 }}
				autoCapitalize="none"
			/>
			<TextInput
				className="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg text-base text-black mb-6"
				textAlignVertical="center"
				style={{ lineHeight: 16 }}
				onChangeText={(text) => setPassword(text)}
				placeholder="Password"
				placeholderTextColor="#9CA3AF"
				secureTextEntry
				autoCapitalize="none"
			/>

			<Pressable
				onPress={() => handleSubmit(email, password)}
				className="w-full bg-black py-3 rounded-lg items-center mb-4"
			>
				<Text className="text-white text-base font-semibold">Login</Text>
			</Pressable>


			{//loggedIn = undefined when first on the page and false when login fails.
			(loggedIn != undefined && !loggedIn) && (
				<Text className="text-red-500 text-sm text-center mb-4">
					Invalid email or password.
				</Text>
			)}

			<Text className="text-gray-500 text-center mb-2">
				Haven't signed up?
			</Text>
			<Pressable className="items-center">
				<Text className="text-black font-semibold">Sign up</Text>
			</Pressable>
		</View>

	)

}
