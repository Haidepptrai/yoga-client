import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { db } from "@/firebaseConfig";
import {
  collection,
  query,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import YogaCourseCard from "@/components/YogaCourseCard";
import { ThemedText } from "@/components/ThemedText";
import mapDocToYogaCourse from "@/utils/mapToCourse";
import { YogaCourse } from "@/interface/YogaCourse";

const CourseListAvailable = () => {
  const [yogaCourses, setYogaCourses] = useState<YogaCourse[]>([]);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const [lastDocument, setLastDocument] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 5;

  useEffect(() => {
    const updateScreenHeight = () => {
      setScreenHeight(Dimensions.get("window").height);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      updateScreenHeight
    );

    // Listen for real-time updates
    const unsubscribe = listenForYogaCourses();

    // Clean up listeners
    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, []);

  const listenForYogaCourses = () => {
    setLoading(true);
    setError(null);

    const coursesQuery = query(
      collection(db, "yoga_courses"),
      where("published", "==", true),
      where("deletedAt", "==", null),
      orderBy("createdAt"),
      limit(pageSize)
    );

    return onSnapshot(
      coursesQuery,
      (snapshot) => {
        const coursesData = snapshot.docs.map(mapDocToYogaCourse);

        setYogaCourses(coursesData);

        if (snapshot.docs.length > 0) {
          setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
        } else {
          setLastDocument(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening for yoga courses:", error);
        setError("Failed to listen for updates. Please try again later.");
        setLoading(false);
      }
    );
  };

  const fetchMoreCourses = async () => {
    if (loading || !lastDocument) return;
    setLoading(true);
    setError(null);

    try {
      const coursesQuery = query(
        collection(db, "yoga_courses"),
        where("published", "==", true),
        where("deletedAt", "==", null),
        orderBy("createdAt"),
        startAfter(lastDocument),
        limit(pageSize)
      );

      const querySnapshot = await getDocs(coursesQuery);

      const newCourses = querySnapshot.docs.map(mapDocToYogaCourse);
      setYogaCourses((prevCourses) => [...prevCourses, ...newCourses]);

      if (querySnapshot.docs.length > 0) {
        setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastDocument(null);
      }
    } catch (fetchError) {
      console.error("Error fetching more courses:", fetchError);
      setError("Failed to load more courses. Please try again later.");
    } finally {
      setLoading(false);
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
    errorText: {
      color: "red",
      textAlign: "center",
      marginVertical: 10,
    },
    loaderContainer: {
      paddingVertical: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ThemedText type="title">Available Courses</ThemedText>

      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : yogaCourses.length === 0 && !loading ? (
        <ThemedText>No courses are currently available.</ThemedText>
      ) : (
        <FlatList
          data={yogaCourses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <YogaCourseCard course={item} context={"available"} />
          )}
          contentContainerStyle={styles.listContent}
          onEndReached={fetchMoreCourses}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#888" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default CourseListAvailable;
