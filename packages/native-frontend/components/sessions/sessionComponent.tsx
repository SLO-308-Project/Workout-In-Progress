import { View, Text, Pressable } from 'react-native';
import { Session } from '@/types/session'

type Props = {
	idx: number;
	date: string;
	duration: string;
	deleteSession: (id: string) => void;
	session: Session;
}

export default function SessionComponent({ idx, date, duration, deleteSession, session }: Props) {
	function deleteThisSession(): void {
		deleteSession(session._id);
	}
	return (
		<View className="px-3 pt-2">
			<View className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-200">
				<Text className="text-lg font-semibold text-black mb-1">Session {idx}</Text>
				<Text className="text-sm text-neutral-700 mb-0.5">{date}</Text>
				<Text className="text-sm text-neutral-700">{duration}</Text>
				<Pressable className="bg-red-100 px-4 py-2 rounded-full active:opacity-90 transition-all duration-200" onPress={deleteThisSession}><Text className="text-red-600 text-sm font-medium text-center">Delete</Text></Pressable>
			</View>
		</View>
	)
}
