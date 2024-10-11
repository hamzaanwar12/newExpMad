// src/components/CongratulationScreen.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

interface CongratulationScreenParams {
  courseTitle: string;
  courseId: string;
}

const CongratulationScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<CongratulationScreenParams>();
  const courseTitle: string = params["courseTitle"];
  const courseId: string = params["courseId"];
  console.log("courseTitle", courseTitle);
  console.log("courseId", courseId);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Congratulations!</Text>
        <View style={styles.iconContainer}>
          <Ionicons name="star" size={60} color="#FFD700" />
        </View>
        <Text style={styles.text}>
          You have completed the course{" "}
          <Text style={styles.courseTitle}>{courseTitle}</Text>
        </Text>
        <TouchableOpacity
          style={styles.button}
          // onPress={() => router.push(`/CourseDescription/${courseId}`)}
          onPress={() => router.push(`/(tabs)`)}
        >
          <Text style={styles.buttonText}>Go Back to Course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  card: ViewStyle;
  title: TextStyle;
  iconContainer: ViewStyle;
  text: TextStyle;
  courseTitle: TextStyle; // New Style for courseTitle
  button: ViewStyle;
  buttonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
    shadowColor: "#000", // Added shadow for better visibility
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow radius
    elevation: 5, // For Android shadow
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Darker color for better contrast
  },
  iconContainer: {
    backgroundColor: "#FFF9C4",
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555", // Slightly darker text for readability
  },
  courseTitle: {
    fontSize: 18, // Increased font size
    fontWeight: "bold", // Bold text
    color: "#6C63FF", // Matching the theme color
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CongratulationScreen;
