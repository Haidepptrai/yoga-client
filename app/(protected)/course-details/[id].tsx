import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { db } from "@/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Colors } from "@/constants/Colors";
import { Button } from "react-native-paper";
import HeaderWithBackButton from "@/components/navigation/HeaderWithBackButton";
import { useAuth } from "@/context/AuthContext";

interface YogaCourseDetails {
  id: number;
  title: string;
  category?: string;
  color?: string;
  description: string;
  capacity: number;
  dayOfWeek: string;
  duration: number;
  pricePerClass: number;
  published: boolean;
  timeOfCourse: string;
  typeOfClass: string;
  createdAt: number;
  updatedAt: number;
}

interface YogaClass {
  id: number;
  classDate: string;
  teacher: string;
  courseId: number;
  comment: string;
}

export default function CourseDetails() {
  const route = useRoute<RouteProp<{ params: { id: string } }, "params">>();
  const { id } = route.params;
  const [course, setCourse] = useState<YogaCourseDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [availableClasses, setAvailableClasses] = useState<YogaClass[]>([]);
  const [showClasses, setShowClasses] = useState<boolean>(false);
  const { user } = useAuth();

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

    const checkUserJoined = async () => {
      try {
        if (!user) return;

        const userCourseRef = doc(
          db,
          "user_joined_course",
          `${user.uid}_${id}`
        );
        const userCourseSnap = await getDoc(userCourseRef);

        if (userCourseSnap.exists()) {
          setIsJoined(true);
        } else {
          setIsJoined(false);
        }
      } catch (error) {
        console.error("Error checking if user joined course:", error);
      }
    };

    fetchCourse();
    checkUserJoined();
  }, [id, user]);

  const joinCourse = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "You must be logged in to join the course.");
        return;
      }

      const userCourseRef = doc(db, "user_joined_course", `${user.uid}_${id}`);
      await setDoc(userCourseRef, {
        userId: user.uid,
        courseId: id,
        joinedAt: Date.now(),
      });

      setIsJoined(true);
      Alert.alert("Success", "You have joined the course!");
    } catch (error) {
      console.error("Error joining course:", error);
      Alert.alert("Error", "Could not join the course. Please try again.");
    }
  };

  const checkoutClasses = async () => {
    try {
      const classesRef = collection(db, "yoga_sessions");
      const q = query(classesRef, where("courseId", "==", Number(id)));
      const querySnapshot = await getDocs(q);
      console.log("querySnapshot", querySnapshot);
      const classes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        classDate: doc.data().classDate,
        teacher: doc.data().teacher,
        courseId: doc.data().courseId,
        comment: doc.data().comment,
      }));

      setAvailableClasses(classes);
      setShowClasses(true);
    } catch (error) {
      console.error("Error fetching available classes:", error);
    }
  };

  const addToCart = async (classId: number) => {
    try {
      if (!user) {
        Alert.alert(
          "Error",
          "You must be logged in to add a class to the cart."
        );
        return;
      }

      const cartRef = doc(db, "user_cart", `${user.uid}_${classId}`);
      await setDoc(cartRef, {
        userId: user.uid,
        classId,
        addedAt: Date.now(),
      });

      Alert.alert("Success", "Class added to cart!");
    } catch (error) {
      console.error("Error adding class to cart:", error);
      Alert.alert("Error", "Could not add class to cart. Please try again.");
    }
  };

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

  const startTime = new Date(`2023-01-01T${course.timeOfCourse}`);
  const endTime = new Date(startTime.getTime() + course.duration * 60000);
  const formattedEndTime = `${endTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderWithBackButton title="Course Details" />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.category}>{course.category}</Text>
      </View>

      {/* Course About Card */}
      <View style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>Course About</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Course name:</Text>
          <Text style={styles.detailValue}>{course.typeOfClass}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{course.duration} mins</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Course Fee:</Text>
          <Text style={styles.detailValue}>${course.pricePerClass}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>
            {course.timeOfCourse} - {formattedEndTime}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Day of Week:</Text>
          <Text style={styles.detailValue}>{course.dayOfWeek}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Capacity:</Text>
          <Text style={styles.detailValue}>{course.capacity} spots</Text>
        </View>
      </View>

      {/* Course Description Section */}
      <Text style={styles.learnTitle}>Course Description</Text>
      <Text style={styles.description}>{course.description}</Text>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        {isJoined ? (
          <>
            <Button
              mode="contained"
              style={styles.checkoutButton}
              onPress={checkoutClasses}
            >
              Checkout Available Class This Week
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            style={styles.joinNowButton}
            onPress={joinCourse}
          >
            JOIN NOW
          </Button>
        )}
      </View>
      <ScrollView>
        {showClasses && (
          <View style={styles.classListContainer}>
            {availableClasses.map((yogaClass) => (
              <View key={yogaClass.id} style={styles.classItem}>
                <Text style={styles.classText}>
                  Date: {yogaClass.classDate}
                </Text>
                <Text style={styles.classText}>
                  Teacher: {yogaClass.teacher}
                </Text>
                <Text style={styles.classComment}>
                  Comment: {yogaClass.comment}
                </Text>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => addToCart(yogaClass.id)}
                >
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  category: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  aboutCard: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  joinNowButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  checkoutButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  learnTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 20,
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
  error: {
    fontSize: 18,
    color: Colors.secondary,
    textAlign: "center",
  },
  // New styles for class list display
  classListContainer: {
    marginTop: 16,
  },
  classItem: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  classText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  classComment: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addToCartText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
