import { YogaCourse } from "@/interface/YogaCourse";
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import YogaCourseCard from "@/components/YogaCourseCard";
import { ThemedText } from "@/components/ThemedText";
import mapDocToYogaCourse from "@/utils/mapToCourse";

const CourseListAvailable = () => {
  const [yogaCourses, setYogaCourses] = useState<YogaCourse[]>([]);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const [lastDocument, setLastDocument] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null); // Track the last fetched document with proper type
  const [hasMore, setHasMore] = useState(true); // Track if there are more courses to load
  const [loading, setLoading] = useState(false); // Track loading state to prevent duplicate calls
  const pageSize = 5; // Number of courses to load per page

  useEffect(() => {
    const updateScreenHeight = () => {
      setScreenHeight(Dimensions.get("window").height);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      updateScreenHeight
    );

    // Initial fetch of yoga courses
    fetchYogaCourses();

    // Clean up event listener
    return () => {
      subscription.remove();
    };
  }, []);

  const fetchYogaCourses = async (
    startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null
  ) => {
    if (loading || !hasMore) return; // Prevent multiple calls when loading or no more data
    setLoading(true);

    try {
      // Construct query with pagination
      let coursesQuery = query(
        collection(db, "yoga_courses"),
        where("published", "==", true),
        where("deletedAt", "==", null),
        orderBy("createdAt"),
        limit(pageSize)
      );

      if (startAfterDoc) {
        coursesQuery = query(coursesQuery, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(coursesQuery);

      if (querySnapshot.docs.length > 0) {
        const coursesData = querySnapshot.docs.map(mapDocToYogaCourse);

        // Append new data to the existing list without duplicating items
        setYogaCourses((prevCourses) => {
          const newCourses = coursesData.filter(
            (newCourse) =>
              !prevCourses.some((prevCourse) => prevCourse.id === newCourse.id)
          );
          return [...prevCourses, ...newCourses];
        });

        setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);

        // If fewer than pageSize documents were fetched, we've reached the end
        if (querySnapshot.docs.length < pageSize) {
          setHasMore(false);
        }
      } else {
        setHasMore(false); // No more documents
      }
    } catch (error) {
      console.error("Error fetching yoga courses:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchYogaCourses(lastDocument);
    }
  };

  const styles = StyleSheet.create({
    container: {
      maxHeight: screenHeight * 0.5,
      backgroundColor: "#F0F4F4",
      paddingVertical: 10,
    },
    listContent: {
      paddingBottom: 20,
    },
  });

  return (
    <View style={styles.container}>
      <ThemedText type="title">Available Courses</ThemedText>
      <FlatList
        data={yogaCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <YogaCourseCard course={item} context={"available"} />
        )}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default CourseListAvailable;
