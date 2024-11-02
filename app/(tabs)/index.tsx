import React from "react";
import { StyleSheet, View } from "react-native";
import HeroHeader from "@/components/HeroHeader"; // Import HeroHeader
import YogaClassList from "@/components/YogaCourseList";

export default function HomeScreen() {
  return (
    <View>
      <HeroHeader userName="Vincent Nguyen" />
      <YogaClassList />
    </View>
  );
}

const styles = StyleSheet.create({});
