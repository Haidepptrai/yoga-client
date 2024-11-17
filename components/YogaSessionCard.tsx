import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import CustomButton from "./CustomButton";

interface YogaSessionCardProps {
  typeOfClass: string;
  classDate: string;
  timeOfCourse: string;
  description: string;
  teacher: string;
  duration: number | null;
  onAddToCart: () => void;
}

const YogaSessionCard: React.FC<YogaSessionCardProps> = ({
  typeOfClass,
  classDate,
  timeOfCourse,
  description,
  teacher,
  duration,
  onAddToCart,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.type}>{typeOfClass || "Unknown Class"}</Text>
        <Text style={styles.date}>
          {classDate || "No Date"} - {timeOfCourse || "No Time"}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.description}>
          {description || "No description available"}
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.teacher}>{teacher || "Unknown Teacher"}</Text>
        <Text style={styles.duration}>
          {duration ? `${duration} mins` : "No Duration"}
        </Text>
      </View>
      <CustomButton label="Add to Cart" onPress={onAddToCart} />
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
  type: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cardBody: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teacher: {
    fontSize: 14,
    color: Colors.textAccent,
    fontStyle: "italic",
  },
  duration: {
    fontSize: 14,
    color: Colors.textAccent,
  },
});
