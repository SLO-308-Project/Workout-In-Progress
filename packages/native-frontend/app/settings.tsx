import { View, Text, Pressable, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function SettingsScreen() {
    const [darkMode, setDarkMode] = useState(false);
    // dark mode toggle
    return (
        <SafeAreaView className="flex-1 px-4">
            <View className="mb-4 w-full flex-row items-center justify-between bg-white p-2 rounded-lg shadow">
                <Text className="font-medium">Dark Mode</Text>
                <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
            <View className="mb-4 w-full flex-row items-center justify-between bg-white p-2 rounded-lg shadow">
                <Text className="font-medium">Dark Mode</Text>
                <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
        </SafeAreaView>
    )
}
