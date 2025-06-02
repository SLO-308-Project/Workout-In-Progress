import {View, Text, Pressable} from "react-native";
import ProtectedRoute from "@/components/auth/protectedRoute";
import {SafeAreaView} from "react-native-safe-area-context";

export default function statistics()
{
    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-white pt-4">
            <View className="pl-4 pt-4 pb-2">
                <Text className="text-3xl font-semibold text-black tracking-tight">
                    Statistics
                </Text>
            </View>
            <Pressable className="shadow-sm p-4 m-2 rounded-md bg-yellow-400 items-center active:opacity-80 transition-all duration-200">
                <Text className="color-white font-semibold">
                    Select Machine
                </Text>
            </Pressable>
        </SafeAreaView>
    );
}
