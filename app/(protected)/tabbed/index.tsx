import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HeroHeader from "@/components/page-sections/home-page/HeroHeader";
import UserCourseList from "@/components/page-sections/home-page/UserCourseList";
import CourseListAvailable from "@/components/page-sections/home-page/CourseListAvailable";
import { useAuth } from "@/context/AuthContext";

const HomePageScreen = () => {
  const { user } = useAuth();

  return (
    <FlatList
      data={[]} // Empty data since we're using ListHeaderComponent for static content
      renderItem={null} // No need to render items directly
      keyExtractor={(_, index) => index.toString()} // Provide a key
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <HeroHeader userName={user?.email ?? "User"} />
          <UserCourseList />
        </View>
      }
      ListFooterComponent={
        <View>
          <CourseListAvailable />
        </View>
      }
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 200,
  },
  headerContainer:{
    rowGap: 16,
  }
});

export default HomePageScreen;
