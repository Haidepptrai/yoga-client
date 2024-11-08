// TabBarButton.tsx
import { Pressable, StyleSheet, PressableProps } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const icons: Record<RouteName, (props: any) => React.JSX.Element> = {
  "tabbed/index": (props) => (
    <MaterialIcons name="home" size={24} color={props.color} />
  ),
  "tabbed/profile": (props) => (
    <MaterialIcons name="person" size={24} color={props.color} />
  ),
  "tabbed/search-class": (props) => (
    <MaterialIcons name="search" size={24} color={props.color} />
  ),
};

export type RouteName =
  | "tabbed/index"
  | "tabbed/profile"
  | "tabbed/search-class";

interface TabBarButtonProps extends PressableProps {
  isFocused: boolean;
  label: string;
  routeName: RouteName;
  color: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  isFocused,
  label,
  routeName,
  color,
  ...props
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, 8]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return { opacity };
  });
  const IconComponent = icons[routeName];
  if (!IconComponent) {
    console.warn(`No icon found for route: ${routeName}`);
  }

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        {IconComponent ? (
          IconComponent({ color })
        ) : (
          <AntDesign name="questioncircleo" size={26} color="gray" />
        )}
      </Animated.View>
      <Animated.Text style={[styles.text, { color }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 11,
  },
});

export default TabBarButton;
