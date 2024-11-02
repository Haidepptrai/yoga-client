import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function CourseDetails() {
  const { id } = useLocalSearchParams(); // Get the id parameter from the route

  return (
    <View>
      {/* <Text>Course ID: {id}</Text> */}
      {/* Render course details based on the `id` */}
    </View>
  );
}
