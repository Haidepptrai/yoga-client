import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import HeroHeader from "@/components/HeroHeader";
import YogaCourseList from "@/components/YogaCourseList";
import CourseListShowcase from "@/components/page-sections/CourseListShowcase";

const HomePageScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <HeroHeader userName={""} />
      <YogaCourseList />
      <CourseListShowcase />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16, // Adjust padding as needed
    marginBottom: 100,
  },
});

export default HomePageScreen;
