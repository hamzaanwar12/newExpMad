import React, { useEffect, useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}) => {

 
  const icons = {
    home: (props: any) => <Feather name="home" size={24} {...props} />,
    explore: (props: any) => <Feather name="compass" size={24} {...props} />,
    profile: (props: any) => <Feather name="user" size={24} {...props} />,
  };

  const renderIcon = icons[routeName] ? icons[routeName] : () => <Text>?</Text>;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]); // Adjust interpolation values as needed
    return {
      opacity, // Apply the interpolated opacity
    };
  });
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.21]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabbarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {renderIcon({ color: isFocused ? "#FFF" : "#222" })}
      </Animated.View>
      <Animated.Text
        style={[
          { color: isFocused ? "#FFF" : "#222", fontSize: 12 },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TabBarButton;
