import React from "react"; 
import { Tabs } from "expo-router"; // Ensure this is the correct import
import { TabBar } from "@/components/TabBar"; // Ensure the path is correct

const TabLayout: React.FC = () => {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false, // Hide headers for all tab screens
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default TabLayout;
