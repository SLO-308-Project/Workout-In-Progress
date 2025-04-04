import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "orange" }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="home" color={color} />
        }}
      />
      <Tabs.Screen
        name="machines"
        options={{
          title: "Machines",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="dumbbell" color={color} />
        }}
      />
    </Tabs>
  );
}
