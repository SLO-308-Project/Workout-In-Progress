import { View, Text, Pressable, Flatlist } from "react-native";
import { Session } from "@/types/session";

type Props = {
    name: number;
    date: string;
    duration: string;
    deleteSession: (id: string) => void;
    session: Session;
};

export default function SessionComponent({
    name,
    date,
    duration,
    deleteSession,
    session,
}: Props) {
    function deleteThisSession(): void {
        deleteSession(session._id);
    }

    // TODO: Display the 2 most worked out muscles in each session card
    // Requires some way of decoding machineId's into machine names.
    // Backend calls are expensive. Perhaps each workout just stores the machines instead of id's?
    // function getMuscles(): string {
    //     const muscles = [];
    // }


    const getSetCount = session.workout.reduce((sum, workout) => {
        return sum + workout.sets.length
    }, 0);

    return (
        <View className="p-4 bg-white shadow-sm border border-neutral-200">
            <View className="flex-row justify-between">
                <Text className="text-lg font-semibold text-black mb-1">
                    Session {name}
                </Text>
                <Text className="text-sm text-neutral-700 mb-1">{date}</Text>
            </View>
            <Text className="text-sm text-neutral-700">{duration}</Text>
            <Text className="text-sm text-neutral-700">{getSetCount} Sets</Text>
        </View>
    );
}

// Component to be rendered when session list is empty
export function Empty() {
    return (
        <Text className="text-3xl font-semibold text-black tracking-tight justify-center items-center">
            No Sessions
        </Text>
    )
}
// <Pressable
//     className="bg-red-100 px-4 py-2 rounded-full active:opacity-90 transition-all duration-200"
//     onPress={deleteThisSession}
// >
//     <Text className="text-red-600 text-sm font-medium text-center">
//         Delete
//     </Text>
// </Pressable>
