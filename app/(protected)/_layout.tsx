// app/(protected)/_layout.tsx
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import TabNavigator from "../TabNavigator";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments(); // Get the current route segments

  useEffect(() => {
    if (!loading && !user) {
      console.log("Redirecting to login");
      router.navigate("/(auth)"); // Redirect to login if not authenticated
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  // Conditional rendering: Use TabNavigator for certain paths and StackNavigator for others
  // return segments.includes("tabbed") ? <TabNavigator /> : <StackNavigator />;
  return (
    <>
      <TabNavigator />
    </>
  );
}
