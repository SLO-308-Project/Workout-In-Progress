import {View, Text} from "react-native";
import ProtectedRoute from "@/components/auth/protectedRoute";
import {SafeAreaView} from "react-native-safe-area-context";

export default function statistics()
{
    return (
        <ProtectedRoute>
            <SafeAreaView>
                <View>
                    <Text>Hi</Text>
                </View>
            </SafeAreaView>
        </ProtectedRoute>
    );
}
