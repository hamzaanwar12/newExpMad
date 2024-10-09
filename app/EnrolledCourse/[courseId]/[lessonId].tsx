import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchLessonWithProgress } from "@/services/lessonService";
import { updateLessonProgress } from "@/services/updateProgressService";
import { Ionicons } from "@expo/vector-icons";

interface CourseLessonParams {
  courseId: string;
  lessonId: string;
}

interface LessonDetail {
  lesson_id: string;
  title: string;
  content: string;
  order: number;
  duration: number;
  created_at: string;
  updated_at: string;
  course: {
    course_id: string;
    course_title: string;
    instructor_name: string;
  };
  progress: {
    is_completed: boolean;
    last_accessed: string | null;
  };
}

const CourseLesson: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<CourseLessonParams>();
  const { courseId, lessonId } = params;
  const user = useSelector((state: RootState) => state.user);
  const userId = user.userId;

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<LessonDetail, Error>({
    queryKey: ["lessonDetail", lessonId, userId],
    queryFn: () => fetchLessonWithProgress(userId, lessonId),
    enabled: !!userId && !!lessonId,
  });

  const mutation = useMutation<void, Error, void>({
    mutationFn: () => updateLessonProgress(userId, lessonId),
    onSuccess: () => {
      Alert.alert("Success", "Lesson marked as completed.");
      queryClient.invalidateQueries(["lessonDetail", lessonId, userId]);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleMarkAsCompleted = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to mark this lesson as completed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => mutation.mutate() },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Lesson not found.</Text>
      </View>
    );
  }

  const { lesson_id, title, content, order, duration, course, progress } = data;
  const isCompleted = progress.is_completed;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.lessonTitle}>{title}</Text>
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, isCompleted ? styles.completed : styles.pending]}>
            {isCompleted ? "Completed" : "Pending"}
          </Text>
          <Ionicons
            name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color={isCompleted ? "#4CAF50" : "#FFC107"}
          />
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailText}>
          <Ionicons name="reader-outline" size={16} color="#666" /> Order: {order}
        </Text>
        <Text style={styles.detailText}>
          <Ionicons name="time-outline" size={16} color="#666" /> Duration: {duration} mins
        </Text>
        <Text style={styles.detailText}>
          <Ionicons name="person-outline" size={16} color="#666" /> Instructor: {course.instructor_name}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{content}</Text>
      </View>
      <View style={styles.actionContainer}>
        {!isCompleted ? (
          <TouchableOpacity style={styles.completeButton} onPress={handleMarkAsCompleted}>
            <Text style={styles.buttonText}>Mark as Completed</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedLabel}>
            <Text style={styles.completedLabelText}>You have completed this lesson.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 25,
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.1, // For iOS shadow
    shadowRadius: 4, // For iOS shadow
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    marginRight: 8,
  },
  completed: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  pending: {
    color: "#FFC107",
    fontWeight: "bold",
  },
  details: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  contentContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  content: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  actionContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  completeButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  completedLabel: {
    backgroundColor: "#E0F7FA",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  completedLabelText: {
    color: "#00796B",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CourseLesson;
