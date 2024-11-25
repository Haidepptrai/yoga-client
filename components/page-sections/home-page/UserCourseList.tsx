import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import YogaCourseCard from "../../YogaCourseCard";
import { YogaCourse } from "@/interface/YogaCourse";
import { ThemedText } from "../../ThemedText";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";

export default function UserCourseList() {
  const [yogaClasses, setYogaClasses] = useState<YogaCourse[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.error("User is not logged in.");
        return;
      }

      try {
        // Step 1: Get the user's joined courses from `user_joined_course`
        const joinedCoursesRef = collection(db, "user_joined_course");
        const joinedCoursesQuery = query(
          joinedCoursesRef,
          where("userId", "==", user.uid)
        );
        const joinedCoursesSnapshot = await getDocs(joinedCoursesQuery);

        const courseIds = joinedCoursesSnapshot.docs.map(
          (doc) => doc.data().courseId
        );

        // Step 2: Fetch details for each course from `yoga_courses`
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
      } catch (error) {
        console.error("Error fetching joined courses:", error);
      }
    };

    fetchData();
  }, [user]);

  const renderItem = ({ item }: { item: YogaCourse }) => (
    <YogaCourseCard course={item} context="joined" />
  );

  return (
    <View style={styles.container}>
      <View>
        <ThemedText type="title">Your Courses</ThemedText>
      </View>
      {yogaClasses.length > 0 ? (
        <FlatList
          data={yogaClasses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 8 }}
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
