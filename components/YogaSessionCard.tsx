import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import CustomButton from "./CustomButton";
import { ThemedText } from "./ThemedText";

interface YogaSessionCardProps {
  typeOfClass: string;
  classDate: string;
  timeOfCourse: string;
  description: string;
  teacher: string;
  duration: number | null;
  onAddToCart: () => void;
  isJoined?: boolean;
}

const YogaSessionCard: React.FC<YogaSessionCardProps> = ({
  typeOfClass,
  classDate,
  timeOfCourse,
  description,
  teacher,
  duration,
  isJoined = false,
  onAddToCart,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText color={Colors.textPrimary}>
          {typeOfClass || "Unknown Class"}
        </ThemedText>
        <ThemedText color={Colors.textSecondary}>
          {classDate || "No Date"} - {timeOfCourse || "No Time"}
        </ThemedText>
      </View>
      <View style={styles.cardFooter}>
        <ThemedText color={Colors.textPrimary}>
          {teacher || "Unknown Teacher"}
        </ThemedText>
        <ThemedText color={Colors.textPrimary}>
          {duration ? `${duration} mins` : "No Duration"}
        </ThemedText>
      </View>
      {!isJoined && <CustomButton label="Add to Cart" onPress={onAddToCart} />}
    </View>
  );
};

export default YogaSessionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
