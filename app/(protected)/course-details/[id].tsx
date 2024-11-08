import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
  limit,
  startAfter,
  QueryDocumentSnapshot,
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
  id: string;
  classDate: string;
  teacher: string;
  courseId: number;
  comment: string;
}

const CourseDetails = () => {
  const route = useRoute<RouteProp<{ params: { id: string } }, "params">>();
  const { id } = route.params;
  const [course, setCourse] = useState<YogaCourseDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [availableClasses, setAvailableClasses] = useState<YogaClass[]>([]);
  const [showClasses, setShowClasses] = useState<boolean>(false);
  const [lastClassDoc, setLastClassDoc] =
    useState<QueryDocumentSnapshot | null>(null);
  const [loadingMoreClasses, setLoadingMoreClasses] = useState<boolean>(false);
  const [hasMoreClasses, setHasMoreClasses] = useState<boolean>(true);
  const { user } = useAuth();
  const pageSize = 5; // Page size for lazy loading

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

  const fetchAvailableClasses = async (
    startAfterDoc: QueryDocumentSnapshot | null = null
  ) => {
    if (loadingMoreClasses || !hasMoreClasses) return;

    setLoadingMoreClasses(true);

    try {
      const classesRef = collection(db, "yoga_sessions");
      const classesQuery = startAfterDoc
        ? query(
            classesRef,
            where("courseId", "==", Number(id)),
            limit(pageSize),
            startAfter(startAfterDoc)
          )
        : query(
            classesRef,
            where("courseId", "==", Number(id)),
            limit(pageSize)
          );

      const querySnapshot = await getDocs(classesQuery);

      if (querySnapshot.docs.length > 0) {
        const classes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          classDate: doc.data().classDate,
          teacher: doc.data().teacher,
          courseId: doc.data().courseId,
          comment: doc.data().comment,
        })) as YogaClass[];

        setAvailableClasses((prevClasses) => [...prevClasses, ...classes]);
        setLastClassDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

        if (querySnapshot.docs.length < pageSize) {
          setHasMoreClasses(false); // No more classes to load
        }
      } else {
        setHasMoreClasses(false); // No more classes available
      }
    } catch (error) {
      console.error("Error fetching available classes:", error);
    } finally {
      setLoadingMoreClasses(false);
    }
  };

  const checkoutClasses = () => {
    setAvailableClasses([]);
    setShowClasses(true);
    fetchAvailableClasses();
  };

  const addToCart = async (classId: string) => {
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

  const renderClassItem = ({ item }: { item: YogaClass }) => (
    <View key={item.id} style={styles.classItem}>
      <Text style={styles.classText}>Date: {item.classDate}</Text>
      <Text style={styles.classText}>Teacher: {item.teacher}</Text>
      <Text style={styles.classComment}>Comment: {item.comment}</Text>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => addToCart(item.id)}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

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

  const formattedEndTime = (() => {
    if (!course) return null;
    const startTime = new Date(`2023-01-01T${course.timeOfCourse}`);
    const endTime = new Date(startTime.getTime() + course.duration * 60000);
    return `${endTime.getHours().toString().padStart(2, "0")}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  })();

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
          <Button
            mode="contained"
            style={styles.checkoutButton}
            onPress={checkoutClasses}
          >
            Checkout Available Classes This Week
          </Button>
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

      {/* Lazy Loaded Class List */}
      {showClasses && (
        <FlatList
          data={availableClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id}
          onEndReached={() => fetchAvailableClasses(lastClassDoc)} // Trigger lazy loading
          onEndReachedThreshold={0.5} // Adjust as needed
          ListFooterComponent={
            loadingMoreClasses ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : null
          }
        />
      )}
    </ScrollView>
  );
};

export default CourseDetails;

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
    color: Colors.white,
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
