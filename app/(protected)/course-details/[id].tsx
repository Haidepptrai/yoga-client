import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Colors } from "@/constants/Colors";

interface YogaCourseDetails {
  id: number;
  title: string;
  category?: string;
  color?: string;
  description: string;
  schedule?: string;
  capacity: number;
  createdAt: number;
  dayOfWeek: string;
  deletedAt?: number | null;
  duration: number;
  pricePerClass: number;
  published: boolean;
  timeOfCourse: string;
  typeOfClass: string;
  updatedAt: number;
}

export default function CourseDetails() {
  const route = useRoute<RouteProp<{ params: { id: string } }, "params">>();
  const router = useRouter();
  const { id } = route.params;
  const [course, setCourse] = useState<YogaCourseDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRef = doc(db, "yoga_courses", id);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          setCourse(courseSnap.data() as YogaCourseDetails);
        } else {
          console.error("Course not found.");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading course details...</Text>
      </View>
    );
  }

  if (!course) {
    return <Text style={styles.error}>Course not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={[
          styles.card,
          { backgroundColor: course.color || Colors.background },
        ]}
      >
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.category}>{course.category}</Text>
        <Text style={styles.description}>{course.description}</Text>

        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Capacity:</Text>
          <Text style={styles.detailValue}>{course.capacity}</Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Day of Week:</Text>
          <Text style={styles.detailValue}>{course.dayOfWeek}</Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{course.duration} minutes</Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Time of Course:</Text>
          <Text style={styles.detailValue}>{course.timeOfCourse}</Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Price per Class:</Text>
          <Text style={styles.detailValue}>${course.pricePerClass}</Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Type of Class:</Text>
          <Text style={styles.detailValue}>{course.typeOfClass}</Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Published:</Text>
          <Text style={styles.detailValue}>
            {course.published ? "Yes" : "No"}
          </Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Created At:</Text>
          <Text style={styles.detailValue}>
            {new Date(course.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Updated At:</Text>
          <Text style={styles.detailValue}>
            {new Date(course.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Button
        mode="contained"
        style={styles.backButton}
        labelStyle={styles.backButtonText}
        onPress={() => router.back()}
      >
        Go Back
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  category: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 10,
    fontStyle: "italic",
  },
  description: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 20,
    lineHeight: 22,
    textAlign: "center",
  },
  detailsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.inputBackground,
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 12,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    borderRadius: 30,
    width: "60%",
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    fontSize: 18,
    color: Colors.secondary,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginTop: 10,
  },
});
