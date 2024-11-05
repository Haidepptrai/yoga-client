import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";

type HeroHeaderProps = {
  greeting?: string;
  userName: string;
};

export default function HeroHeader({
  greeting = "Good Day",
  userName,
}: HeroHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <ThemedText type="default" style={styles.greetingText}>
          {greeting}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.userName}>
          {userName}
        </ThemedText>
      </View>
      <View style={styles.iconContainer}>
        <IconButton
          icon="cart-outline"
          size={24}
          onPress={() => router.push("/cart")}
        />
        <IconButton
          icon="bell-outline"
          size={24}
          onPress={() => console.log("Notification Pressed")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  textContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: "#888",
  },
  userName: {
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
