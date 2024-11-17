// app/(protected)/TabNavigator.tsx
import React from "react";
import { Tabs } from "expo-router";
import TabBar from "../components/navigation/TabBar";

export default function TabNavigator() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="tabbed/index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="tabbed/profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="tabbed/search-class"
        options={{
          title: "Search Classes",
        }}
      />
    </Tabs>
  );
}
