import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';

type Props = {
	handleSubmit: (email: string, password: string) => void;
}

export default function LoginPrompt({ handleSubmit }: Props) {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	return (
		<View>
			<TextInput onChangeText={(text) => setEmail(text.trim())} placeholder="Email" placeholderTextColor="#7A7674" />
			<TextInput onChangeText={(text) => setPassword(text)} placeholder="Password" placeholderTextColor="#7A7674" />
			<Pressable onPress={() => handleSubmit(email, password)}><Text>Login</Text></Pressable>
			<Text>
				Haven't signed up?
			</Text>
			<Pressable>
				<Text>Sign up</Text>
			</Pressable>
		</View>

	)

}
