import { Colors } from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "./ThemedText";
import { YogaCourse } from "@/interface/YogaCourse";

interface YogaCourseCardProps {
  course: YogaCourse;
  context: "available" | "joined";
}

const YogaCourseCard: React.FC<YogaCourseCardProps> = ({ course, context }) => {
  const router = useRouter();

  const handlePressToViewCourse = () => {
    router.push({
      pathname: "/course-details/[id]",
      params: { id: course.id.toString() },
    });
  };

  // Calculate the end time of the course by adding the duration (if available)
  const startTime = course.timeOfCourse
    ? new Date(`2023-01-01T${course.timeOfCourse}`)
    : null;
  const endTime = startTime
    ? new Date(startTime.getTime() + (course.duration || 0) * 60000)
    : null;
  const formattedEndTime =
    endTime &&
    `${endTime.getHours().toString().padStart(2, "0")}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  return (
    <Pressable onPress={handlePressToViewCourse} style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.courseType}>{course.typeOfClass}</Text>
        <View>
          <Text style={styles.timeText}>
            {course.timeOfCourse} - {formattedEndTime}
          </Text>
        </View>
      </View>

      {/* Conditional Rendering Based on Context */}

      <View style={styles.infoRow}>
        <ThemedText style={styles.dayText}>
          Occur on: {course.dayOfWeek}
        </ThemedText>
      </View>
      {context === "available" && (
        <View style={styles.footer}>
          <Text style={styles.priceText}>${course.price} for whole course</Text>
          <Text style={styles.capacityText}>
            {course.capacity} spots available
          </Text>
        </View>
      )}

      {/* {context === "joined" && (
        <>
          <Text style={styles.joinedAtText}>
            Joined on: {new Date(course.joinedAt || "").toLocaleDateString()}
          </Text>
        </>
      )} */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 32,
  },
  courseType: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  timeText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  dayText: {
    color: Colors.textSecondary,
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  capacityText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  joinedAtText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 8,
  },
});

export default YogaCourseCard;
