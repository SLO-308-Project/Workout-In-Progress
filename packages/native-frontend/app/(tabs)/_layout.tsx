import {MaterialCommunityIcons, AntDesign} from "@expo/vector-icons";
import {Tabs} from "expo-router";
import ProtectedRoute from "@/components/auth/protectedRoute";

export default function TabLayout()
{
    return (
        <ProtectedRoute>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "orange",
                    tabBarStyle: {
                        height: 80,
                        paddingBottom: 20,
                        paddingTop: 10,
                    },
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: ({color}) => (
                            <MaterialCommunityIcons
                                size={28}
                                name="home"
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="currSession"
                    options={{
                        title: "Current Session",
                        tabBarIcon: ({color}) => (
                            <AntDesign
                                size={28}
                                name="pluscircleo"
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="templates"
                    options={{
                        title: "Templates",
                        tabBarIcon: ({color}) => (
                            <AntDesign
                                size={28}
                                name="folderopen"
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="machines"
                    options={{
                        title: "Machines",
                        tabBarIcon: ({color}) => (
                            <MaterialCommunityIcons
                                size={28}
                                name="dumbbell"
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </ProtectedRoute>
    );
}
