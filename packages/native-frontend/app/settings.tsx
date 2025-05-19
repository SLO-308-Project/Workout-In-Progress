import {View, Text, Pressable, Switch} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useState} from "react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import {useAuth} from "@/util/authContext";

// NOTE: If you want to add more settings, make sure they are reflected in the database. You will have to add the CRUD to store and retrieve settings.
export default function SettingsScreen()
{
    const [darkMode, setDarkMode] = useState(false);
    const {logout} = useAuth();
    // dark mode toggle
    return (
        <ProtectedRoute>
            <SafeAreaView className="flex-1 px-4">
                <View className="mb-4 w-full flex-row items-center justify-between bg-white p-2 rounded-lg shadow">
                    <Text className="font-medium">Dark Mode</Text>
                    <Switch value={darkMode} onValueChange={setDarkMode} />
                </View>
                <Pressable
                    onPress={logout}
                    className="mb-4 w-full flex-row items-center justify-center bg-red-100 p-4 rounded-lg"
                >
                    <Text className="font-medium text-red-600">Logout</Text>
                </Pressable>
            </SafeAreaView>
        </ProtectedRoute>
    );
}
