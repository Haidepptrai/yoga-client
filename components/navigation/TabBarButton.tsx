import { Pressable, StyleSheet, PressableProps, TextStyle } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Define the type for icons
const icons: {
  "tabbed/index": (props: any) => React.JSX.Element;
  "tabbed/profile": (props: any) => React.JSX.Element;
} = {
  "tabbed/index": (props) => <></>, // Replace with actual icons
  "tabbed/profile": (props) => <></>, // Replace with actual icons
};

export type RouteName = "tabbed/index" | "tabbed/profile"; // Union type of route names

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
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
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

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        {icons[routeName]({ color })} {/* Type-safe access */}
      </Animated.View>
      <Animated.Text
        style={[{ color, fontSize: 11 } as TextStyle, animatedTextStyle]}
      >
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
});

export default TabBarButton;
