import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import YogaCourseCard from "../../YogaCourseCard";
import { YogaCourse } from "@/interface/YogaCourse";
import { ThemedText } from "../../ThemedText";
import {
  collection,
  query,
  where,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";

export default function UserCourseList() {
  const [yogaClasses, setYogaClasses] = useState<YogaCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError("User is not logged in.");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, "user_joined_course"),
        where("userId", "==", user.uid)
      ),
      async (snapshot) => {
        setIsLoading(true);
        setError(null);

        try {
          const courseIds = snapshot.docs.map((doc) => doc.data().courseId);

          if (courseIds.length === 0) {
            setYogaClasses([]);
            setIsLoading(false);
            return;
          }

          // Fetch details for each course from `yoga_courses`
          const courseDetailsPromises = courseIds.map(async (courseId) => {
            const courseRef = doc(db, "yoga_courses", courseId.toString());
            const courseSnap = await getDoc(courseRef);

            if (courseSnap.exists()) {
              return {
                ...(courseSnap.data() as YogaCourse),
                id: courseId,
              };
            }
            return null;
          });

          const courses = (await Promise.all(courseDetailsPromises)).filter(
            (course) => course !== null
          ) as YogaCourse[];

          setYogaClasses(courses);
        } catch (fetchError) {
          console.error("Error fetching joined courses:", fetchError);
          setError("Failed to load your courses. Please try again.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error listening to joined courses:", error);
        setError("Failed to listen for updates. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const renderItem = ({ item }: { item: YogaCourse }) => (
    <YogaCourseCard course={item} context="joined" />
  );

  return (
    <View style={styles.container}>
      <View>
        <ThemedText type="title">Your Courses</ThemedText>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#888" />
      ) : error ? (
        <ThemedText>{error}</ThemedText>
      ) : yogaClasses.length > 0 ? (
        <FlatList
          data={yogaClasses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          contentContainerStyle={{ gap: 8 }}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <ThemedText>You have not joined any courses yet.</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  viewAll: {
    fontSize: 14,
    color: "#888",
  },
});
