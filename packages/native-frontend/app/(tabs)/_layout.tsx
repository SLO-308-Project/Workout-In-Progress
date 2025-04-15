import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ 
        tabBarActiveTintColor: "orange",
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 10
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="home" color={color} />
        }}
      />
      <Tabs.Screen
        name="currSession"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="pluscircleo" color={color} />
          )
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
