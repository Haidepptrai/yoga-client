import { Colors } from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router"; // Import the router for navigation

export interface YogaCourse {
  id: number;
  dayOfWeek: string;
  timeOfCourse: string;
  duration: number;
  capacity: number;
  pricePerClass: number;
  typeOfClass: string;
  description: string;
  isPublished: boolean;
}

interface YogaCourseCardProps {
  course: YogaCourse;
}

const YogaCourseCardAvailable: React.FC<YogaCourseCardProps> = ({ course }) => {
  const router = useRouter();

  const handlePressToViewCourse = () => {
    router.push({
      pathname: "/course-details/[id]",
      params: { id: course.id.toString() },
    });
  };

  // Calculate the end time of the course by adding the duration
  const startTime = new Date(`2023-01-01T${course.timeOfCourse}`);
  const endTime = new Date(startTime.getTime() + course.duration * 60000);
  const formattedEndTime = `${endTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`;

  return (
    <Pressable onPress={handlePressToViewCourse} style={styles.card}>
      {/* Course Header */}
      <View style={styles.header}>
        <Text style={styles.courseType}>{course.typeOfClass}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {course.isPublished ? "Published" : "Unpublished"}
          </Text>
        </View>
      </View>

      {/* Course Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoColumn}>
          <Text style={styles.dayText}>{course.dayOfWeek}</Text>
          <Text style={styles.timeText}>
            {course.timeOfCourse} - {formattedEndTime}
          </Text>
        </View>
        <View style={styles.arrow}>
          <Text style={styles.arrowIcon}>⏳</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.detailText}>Duration</Text>
          <Text style={styles.timeText}>{course.duration} mins</Text>
        </View>
      </View>

      {/* Course Description */}
      <Text style={styles.description}>{course.description}</Text>

      {/* Price and Capacity */}
      <View style={styles.footer}>
        <Text style={styles.priceText}>${course.pricePerClass} per class</Text>
        <Text style={styles.capacityText}>
          {course.capacity} spots available
        </Text>
      </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  infoColumn: {
    flexDirection: "column",
    alignItems: "center",
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
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  arrow: {
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    fontSize: 20,
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
});

export default YogaCourseCardAvailable;
