import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import YogaCourseCard from "./YogaCourseCard";
import { YogaCourse } from "@/interface/YogaCourse";
import { ThemedText } from "./ThemedText";

const yogaClasses: YogaCourse[] = [
  {
    id: 1,
    dayOfWeek: "Monday",
    timeOfCourse: "10:00 AM",
    duration: 60,
    capacity: 20,
    pricePerClass: 15,
    typeOfClass: "Hatha Yoga",
    description: "Beginner-friendly Hatha Yoga class",
    isPublished: true,
    category: "Beginner",
  },
  {
    id: 2,
    dayOfWeek: "Wednesday",
    timeOfCourse: "1:00 PM",
    duration: 75,
    capacity: 15,
    pricePerClass: 20,
    typeOfClass: "Vinyasa Yoga",
    description: "Flow-based yoga session for intermediates",
    isPublished: true,
    category: "Intermediate",
  },
  // Additional courses...
];

export default function YogaClassList() {
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
