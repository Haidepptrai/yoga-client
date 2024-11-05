import { YogaCourse } from "@/interface/YogaCourse";
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import YogaCourseCardAvailable from "../YogaCourseCardAvailable";

// Mock data for the yoga courses
const mockYogaCourses: YogaCourse[] = [
  {
    id: 1,
    dayOfWeek: "Monday",
    timeOfCourse: "09:00",
    duration: 60,
    capacity: 20,
    pricePerClass: 15,
    typeOfClass: "Vinyasa Yoga",
    description: "A dynamic flow class focusing on breath and movement.",
    isPublished: true,
  },
  {
    id: 2,
    dayOfWeek: "Tuesday",
    timeOfCourse: "10:30",
    duration: 45,
    capacity: 15,
    pricePerClass: 12,
    typeOfClass: "Hatha Yoga",
    description: "A gentle class perfect for beginners.",
    isPublished: true,
  },
  {
    id: 3,
    dayOfWeek: "Wednesday",
    timeOfCourse: "18:00",
    duration: 90,
    capacity: 25,
    pricePerClass: 20,
    typeOfClass: "Power Yoga",
    description: "An intense class to build strength and stamina.",
    isPublished: false,
  },
  {
    id: 4,
    dayOfWeek: "Thursday",
    timeOfCourse: "07:00",
    duration: 60,
    capacity: 18,
    pricePerClass: 15,
    typeOfClass: "Restorative Yoga",
    description: "A slow-paced class focusing on relaxation.",
    isPublished: true,
  },
  {
    id: 5,
    dayOfWeek: "Friday",
    timeOfCourse: "12:00",
    duration: 50,
    capacity: 12,
    pricePerClass: 14,
    typeOfClass: "Yin Yoga",
    description: "A meditative class focusing on deep stretching.",
    isPublished: true,
  },
];

const CourseListShowcase = () => {
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const updateScreenHeight = () => {
      setScreenHeight(Dimensions.get("window").height);
    };

    Dimensions.addEventListener("change", updateScreenHeight);
  }, []);

  const styles = StyleSheet.create({
    container: {
      maxHeight: screenHeight * 0.5,
      backgroundColor: "#F0F4F4",
      paddingVertical: 10,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
  });
  return (
    <View style={styles.container}>
      <FlatList
        data={mockYogaCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <YogaCourseCardAvailable course={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default CourseListShowcase;
