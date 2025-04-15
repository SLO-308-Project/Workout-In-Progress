import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Set } from '@/types/set';
import { AttributeValue } from '@/types/attributeValue';
import SetComponent from '@/components/currSession/setComponent';
import SetForm from '@/components/currSession/setForm';

type Props = {
	machineName: string | undefined;
	machineId: string;
	workoutId: string;
	handleDelete: (workoutId: string) => void;
}


export default function Workout({ machineName, machineId, workoutId, handleDelete }: Props) {
	const [showSets, setShowSets] = useState(false);
	const [sets, setSets] = useState<Set[]>([]);

	function addSet(attributeValues: AttributeValue[]) {
		const newSet: Set = {
			_id: sets.length.toString(),
			attributeValues: attributeValues,
		};
		setSets([...sets, newSet]);
	}

	const setList = () =>
		sets.map((set: Set, index) => <SetComponent key={index} set={set} index={index + 1} />);

	return (
		<View className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 m-4">
			<Pressable
				onPress={() => setShowSets(!showSets)}
				className="flex-row justify-between items-center active:opacity-75"
			>
				<Text className="text-xl font-semibold text-gray-900">
					{machineName}
				</Text>
				<Pressable
					onPress={(event) => {
						event.stopPropagation();
						handleDelete(workoutId);
					}}
					className="bg-red-50 px-3 py-1 rounded-full"
				>
					<Text className="text-sm text-red-600">Delete</Text>
				</Pressable>
			</Pressable>

			{showSets && (
				<View className="mt-4">
					{setList()}
					<SetForm handleSubmit={addSet} machineId={machineId} />
				</View>
			)}
		</View>
	)

}
