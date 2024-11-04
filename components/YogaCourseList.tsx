import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import YogaCourseCard from "./YogaCourseCard";
import { YogaCourse } from "@/interface/YogaCourse";
import { ThemedText } from "./ThemedText";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function YogaCourseList() {
  const [yogaClasses, setYogaClasses] = useState<YogaCourse[]>([]);

  const categories = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subCollectionRef = collection(db, "yoga_courses");
        const querySnapshot = await getDocs(subCollectionRef);

        const subCollectionData: YogaCourse[] = querySnapshot.docs.map(
          (doc) => ({
            ...(doc.data() as YogaCourse), // Cast doc.data() to YogaCourse
            category: categories[Math.floor(Math.random() * categories.length)], // Random category
          })
        );

        setYogaClasses(subCollectionData);
      } catch (error) {
        console.error("Error fetching yoga courses:", error);
      }
    };

    fetchData();
  }, []);

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
