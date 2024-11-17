import { Colors } from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export interface YogaCourse {
  id: number;
  dayOfWeek?: string;
  timeOfCourse?: string;
  duration?: number;
  capacity?: number;
  pricePerClass?: number;
  typeOfClass: string;
  description?: string;
  isPublished?: boolean;
  joinedAt?: string; // For joined courses
}

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
        {context === "available" && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {course.isPublished ? "Published" : "Unpublished"}
            </Text>
          </View>
        )}
      </View>

      {/* Conditional Rendering Based on Context */}
      {context === "available" && (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.dayText}>{course.dayOfWeek}</Text>
            <Text style={styles.timeText}>
              {course.timeOfCourse} - {formattedEndTime}
            </Text>
          </View>
          <Text style={styles.description}>{course.description}</Text>
          <View style={styles.footer}>
            <Text style={styles.priceText}>
              ${course.pricePerClass} per class
            </Text>
            <Text style={styles.capacityText}>
              {course.capacity} spots available
            </Text>
          </View>
        </>
      )}

      {context === "joined" && (
        <>
          <Text style={styles.joinedAtText}>
            Joined on: {new Date(course.joinedAt || "").toLocaleDateString()}
          </Text>
        </>
      )}
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
  },
  courseType: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statusBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  dayText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timeText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "600",
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
