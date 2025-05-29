import {Workout} from "@/types/workout";
import {FlatList, Text, View} from "react-native";
import DisplaySet from "./displaySet";
import {Machine} from "@/types/machine";

type Props = {
    allMachines: Machine[];
    workout: Workout;
};

export default function DisplayWorkout({allMachines, workout}: Props)
{
    const machine = allMachines.find(
        (machine) => machine._id === workout.machineId,
    );

    return (
        <View className="bg-gray-200 border border-gray-400 rounded-lg shadow-sm p-2 m-1 justify-center">
            <Text className="text-xl font-bold">{machine?.name}</Text>
            <Text className="pl-2 text-lg">{machine?.muscle}</Text>
            <FlatList
                data={workout.sets}
                renderItem={({item, index}) => (
                    <DisplaySet machine={machine} set={item} index={index} />
                )}
            />
        </View>
    );
}
