import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import { YogaCourseCardProps } from "@/types/YogaCourseCardProps";
import { ThemedText } from "./ThemedText";

export default function YogaCourseCard({
  id,
  title,
  category = "All Levels",
  color = "#FFFFFF",
}: YogaCourseCardProps) {
  const router = useRouter();

  const handlePressToViewCourse = () => {
    router.push({
      pathname: "(protected)/course-details/[id]",
      params: { id: id.toString() },
    });
  };

  return (
    <Card style={[styles.card, { backgroundColor: color }]}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.category}>{category}</ThemedText>
      <Button
        mode="contained"
        style={styles.joinButton}
        onPress={handlePressToViewCourse}
        textColor="black"
      >
        View Course
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: 200,
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 6,
  },
});
