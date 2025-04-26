import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';

type Props = {
	handleSubmit: (email: string, password: string) => void;
	loginFailed: boolean;
}

export default function LoginPrompt({ handleSubmit, loginFailed }: Props) {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	return (
		<View>
			<TextInput onChangeText={(text) => setEmail(text.trim())} placeholder="Email" placeholderTextColor="#7A7674" />
			<TextInput onChangeText={(text) => setPassword(text)} placeholder="Password" placeholderTextColor="#7A7674" />
			<Pressable onPress={() => handleSubmit(email, password)}><Text>Login</Text></Pressable>
                {loginFailed && (<Text className="text-red-500">Invalid email or password.</Text>)}
			<Text>
				Haven't signed up?
			</Text>
			<Pressable>
				<Text>Sign up</Text>
			</Pressable>
		</View>

	)

}
