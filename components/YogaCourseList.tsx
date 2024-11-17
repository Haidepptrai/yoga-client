import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import YogaCourseCard from "./YogaCourseCard";
import { YogaCourse } from "@/interface/YogaCourse";
import { ThemedText } from "./ThemedText";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext"; // Assuming you have a useAuth hook

export default function YogaCourseList() {
  const [yogaClasses, setYogaClasses] = useState<YogaCourse[]>([]);
  const { user } = useAuth(); // Get the current user
  const categories = ["Beginner", "Intermediate", "Advanced"];

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
              ...(courseSnap.data() as YogaCourse), // Cast doc.data() to YogaCourse
              id: courseId,
              category:
                categories[Math.floor(Math.random() * categories.length)], // Assign random category
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

  const colors = [
    "#FAD7A0",
    "#FAD1C8",
    "#A5D6A7",
    "#C5CAE9",
    "#FFD700",
    "#8A2BE2",
    "#FF69B4",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderItem = ({ item }: { item: YogaCourse }) => (
    <YogaCourseCard
      id={item.id}
      title={item.typeOfClass}
      category={item.category}
      color={getRandomColor()}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Your Courses</ThemedText>
        <ThemedText type="link">View all</ThemedText>
      </View>
      <FlatList
        data={yogaClasses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: "#f9f9f9",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  viewAll: {
    fontSize: 14,
    color: "#888",
  },
  listContainer: {
    paddingLeft: 16,
  },
});
