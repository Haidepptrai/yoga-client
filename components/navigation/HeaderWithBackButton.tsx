// components/navigation/HeaderWithBackButton.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have @expo/vector-icons installed

interface HeaderWithBackButtonProps {
  title?: string;
  onBackPress?: () => void; // Optional custom back action
}

const HeaderWithBackButton: React.FC<HeaderWithBackButtonProps> = ({
  title,
  onBackPress,
}) => {
  const router = useRouter();

  // Use the provided onBackPress or default to router.back()
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.shadow,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
});

export default HeaderWithBackButton;
