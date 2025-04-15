import { View, Text, Pressable } from 'react-native';
import { Session } from '@/types/session'

type Props = {
	key: number;
	date: string;
	duration: string;
	deleteSession: (id: string) => void;
	session: Session;
}

export default function SessionComponent({ key, date, duration, deleteSession, session } : Props) {
	function deleteThisSession(): void {
		deleteSession(session._id);
	}
	return (
		<View>
			<Text>Session {key}</Text>
			<Text>{date}</Text>
			<Text>{duration}</Text>
			<Pressable className="bg-blue-600 px-6 py-3 rounded-x1" onPress={deleteThisSession}><Text>-</Text></Pressable>
		</View>
	)
}
