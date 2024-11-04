// app/(protected)/StackNavigator.tsx
import React from "react";
import { Stack } from "expo-router";

export default function StackNavigator() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="details" options={{ title: "Details" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
