import HeroHeader from "@/components/HeroHeader";
import YogaCourseList from "@/components/YogaCourseList";
import { View } from "react-native";

const HomePageScreen = () => {
  return (
    <View>
      <HeroHeader userName={""} />
      <YogaCourseList />
    </View>
  );
};
export default HomePageScreen;
