import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
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
  orderBy,
} from "firebase/firestore";
import { Colors } from "@/constants/Colors";
import HeaderWithBackButton from "@/components/navigation/HeaderWithBackButton";
import { useAuth } from "@/context/AuthContext";
import { YogaSession } from "@/interface/YogaSession";
import YogaSessionCard from "@/components/YogaSessionCard";
import { addToCart } from "@/utils/addToCart";
import CustomButton from "@/components/CustomButton";
import { YogaCourse } from "@/interface/YogaCourse";
import { ThemedText } from "@/components/ThemedText";

const CourseDetails = () => {
  const route = useRoute<RouteProp<{ params: { id: string } }, "params">>();
  const { id } = route.params;
  const [course, setCourse] = useState<YogaCourse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [availableClasses, setAvailableClasses] = useState<YogaSession[]>([]);
  const [lastClassDoc, setLastClassDoc] =
    useState<QueryDocumentSnapshot | null>(null);
  const [loadingMoreClasses, setLoadingMoreClasses] = useState<boolean>(false);
  const [hasMoreClasses, setHasMoreClasses] = useState<boolean>(true);
  const { user } = useAuth();
  const pageSize = 5;
  const firstLoad = useRef(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRef = doc(db, "yoga_courses", id);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          setCourse(courseSnap.data() as YogaCourse);
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
    try {
      if (!hasMoreClasses || !firstLoad.current) {
        return; // Exit if there are no more classes
      }

      const classesRef = collection(db, "yoga_sessions");
      // Base query with explicit orderBy and where clause
      let baseQuery = query(
        classesRef,
        where("courseId", "==", Number(id)),
        orderBy("classDate", "asc"), // Ensure explicit order by 'classDate'
        limit(pageSize)
      );
      // Add pagination if startAfterDoc is valid
      if (startAfterDoc && startAfterDoc instanceof QueryDocumentSnapshot) {
        baseQuery = query(baseQuery, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(baseQuery);
      if (querySnapshot.docs.length > 0) {
        const classes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          typeOfClass: course?.typeOfClass,
          duration: course?.duration,
          timeOfCourse: course?.timeOfCourse,
          ...doc.data(),
        })) as unknown as YogaSession[];

        // Update state with fetched data
        setAvailableClasses((prevClasses) => [...prevClasses, ...classes]);
        setLastClassDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

        // If fewer than the pageSize documents are fetched, no more classes are left
        if (querySnapshot.docs.length < pageSize) {
          setHasMoreClasses(false);
        }
      } else {
        setHasMoreClasses(false);
      }
    } catch (error) {
      console.error("Error fetching available classes:", error);
    } finally {
      setLoadingMoreClasses(false);
    }
  };

  const handleAddToCart = (classId: number) => {
    if (user) {
      addToCart(user.uid, classId);
    }
  };

  const renderClassItem = ({ item }: { item: YogaSession }) => (
    <YogaSessionCard
      key={item.id}
      typeOfClass={item.typeOfClass || "Unknown Class"}
      classDate={item.classDate || "No Date"}
      timeOfCourse={item.timeOfCourse || "No Time"}
      description={item.description || "No description available"}
      teacher={item.teacher || "Unknown Teacher"}
      duration={item.duration || null}
      onAddToCart={() => handleAddToCart(Number(item.id))}
    />
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

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <HeaderWithBackButton title="Course Details" />
          <View style={styles.aboutCard}>
            <Text style={styles.sectionTitle}>Course About</Text>
            <ThemedText type="title" color={Colors.primary}>
              Course About
            </ThemedText>
            <View style={styles.detailsRow}>
              <ThemedText color={Colors.textSecondary}>Course name:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {course.typeOfClass}
              </ThemedText>
            </View>
            <View style={styles.detailsRow}>
              <ThemedText color={Colors.textSecondary}>
                Day available:
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                {course.dayOfWeek}
              </ThemedText>
            </View>
            <View style={styles.detailsRow}>
              <ThemedText color={Colors.textSecondary}>
                Duration each class:
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                {course.duration} mins
              </ThemedText>
            </View>
            <View style={styles.detailsRow}>
              <ThemedText color={Colors.textSecondary}>Course Fee:</ThemedText>
              <ThemedText style={styles.detailValue}>
                ${course.price}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.learnTitle}>Course Description</ThemedText>
          <ThemedText style={styles.description}>
            {course.description || "None"}
          </ThemedText>
          <View style={styles.buttonContainer}>
            {isJoined ? (
              <CustomButton
                label="Checkout Available Classes This Week"
                onPress={() => {
                  firstLoad.current = true;
                  fetchAvailableClasses();
                }}
                style={styles.checkoutButton}
                textColor="#FFF"
              />
            ) : (
              <CustomButton
                label="JOIN NOW"
                onPress={joinCourse}
                style={styles.joinNowButton}
                textColor="#FFF"
              />
            )}
          </View>
        </View>
      }
      data={isJoined ? availableClasses : []}
      renderItem={renderClassItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => {
        if (!firstLoad.current) {
          return; // Skip first load
        }
        fetchAvailableClasses(lastClassDoc);
      }}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.container}
      ListFooterComponent={
        loadingMoreClasses ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : null
      }
      keyboardShouldPersistTaps="handled" // Ensure taps are registered
    />
  );
};

export default CourseDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
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
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    paddingHorizontal: 16,
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
