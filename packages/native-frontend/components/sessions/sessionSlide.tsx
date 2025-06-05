import {Session} from "@/types/session";
import {FlatList, Text, View} from "react-native";
import {Machine} from "@/types/machine";
import DisplayWorkout from "./displayWorkout";

type Props = {
    allMachines: Machine[];
    currentSession: Session | null;
    name: string;
    date: string;
    duration: string;
};

export default function SessionSlide({
    allMachines,
    currentSession,
    name,
    date,
    duration,
}: Props)
{
    return (
        <View>
            <View className="">
                <Text className="px-4 pt-3 rounded-xl text-2xl font-bold text-black">
                    {name}
                </Text>
                <Text className="px-8 pt-1 text-xl">Date:{" " + date}</Text>
                <Text className="px-8 py-1 text-xl">Time:{" " + duration}</Text>
            </View>
            {/* Render each Workout */}
            <View className="bg-gray-100 border border-gray-400 rounded-lg shadow-sm p-2 m-1 justify-center">
                <Text className="text-xl font-bold">Machines:</Text>
                <FlatList
                    data={currentSession?.workout}
                    renderItem={({item, index}) => (
                        <DisplayWorkout
                            allMachines={allMachines}
                            workout={item}
                        />
                    )}
                    ListEmptyComponent={
                        <Text className="text-2xl">Empty Session</Text>
                    }
                />
            </View>
        </View>
    );
}
