import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import HeroHeader from "@/components/page-sections/home-page/HeroHeader";
import UserCourseList from "@/components/page-sections/home-page/UserCourseList";
import { useAuth } from "@/context/AuthContext";
import CourseListAvailable from "@/components/page-sections/home-page/CourseListAvailable";

const HomePageScreen = () => {
  const { user } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <HeroHeader userName={user?.email ?? "User"} />
      <UserCourseList />
      <CourseListAvailable />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
    gap: 16,
  },
});

export default HomePageScreen;
