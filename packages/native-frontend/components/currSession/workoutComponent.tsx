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
		<View>
			<Pressable onPress={() => setShowSets(!showSets)}>
				<Text>{machineName}</Text>
				<Pressable onPress={(event) => {
					event.stopPropagation();
					handleDelete(workoutId)
				}}>
					<Text>Delete</Text>
				</Pressable>
				{showSets && setList()}
				{showSets && (
					<SetForm handleSubmit={addSet} machineId={machineId} />
				)}
			</Pressable>
		</View>
	)

}
