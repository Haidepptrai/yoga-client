// app/_layout.tsx
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <SafeAreaView
            style={styles.safeArea}
            edges={["top", "bottom", "left", "right"]}
          >
            <Stack screenOptions={{ headerShown: false }}>{children}</Stack>
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background, // Default background color for the app
  },
});
