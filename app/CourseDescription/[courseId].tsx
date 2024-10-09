// src/components/CourseDescription.tsx

import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Alert,
  } from "react-native";
  import { useRouter, useLocalSearchParams } from "expo-router";
  import { fetchCourseById } from "@/services/courseDetailService";
  import { enrollForFree } from "@/services/enrollInCourse";
  import { useEffect, useState } from "react";
  import { Ionicons } from "@expo/vector-icons";
  import { useMutation } from "@tanstack/react-query";
  import { useSelector } from "react-redux";
  import { RootState } from "@/store/store";
  import * as Progress from 'react-native-progress'; // Install react-native-progress if not already
  
  export interface Lesson {
    lesson_id: string;
    lesson_title: string;
    lesson_content: string;
    lesson_order: number;
    lesson_duration: number;
    lesson_created_at: string;
    lesson_updated_at: string;
    is_completed: boolean;
  }
  
  export interface CourseDetail {
    course_id: string;
    course_title: string;
    course_description: string;
    is_free: boolean;
    price: number | null;
    course_duration: number;
    difficulty_level: string;
    banner_image_url: string;
    course_created_at: string;
    course_updated_at: string;
    instructor_name: string;
    is_enrolled: boolean;
    completion_status: string;
    course_progress: number;
    lessons: Lesson[];
  }
  
  interface CourseDescriptionParams {
    courseId: string;
  }
  
  const lessonColors = [
    "#FFB3BA",
    "#BAFFC9",
    "#BAE1FF",
    "#FFFFBA",
    "#FFDFBA",
    "#E0BBE4",
    "#957DAD",
    "#D291BC",
    "#FEC8D8",
    "#FFDFD3",
  ];
  
  const CourseDescription: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams<CourseDescriptionParams>();
    const courseId: string = params["courseId"];
    const user = useSelector((state: RootState) => state.user);
    const userId = user.userId;
  
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const mutation = useMutation({
      mutationFn: (courseId: string) => enrollForFree(userId, courseId),
      onSuccess: () => {
        Alert.alert("Enrollment Successful", "You have successfully enrolled in the course.");
        setTimeout(() => {
          router.push(`/EnrolledCourse/${courseId}/${course?.lessons[0]?.lesson_id}`);
        }, 1000);
      },
      onError: (error: any) => {
        Alert.alert("Enrollment Failed", error.message);
        console.error("Enrollment failed:", error);
      },
    });
  
    useEffect(() => {
      const loadCourse = async () => {
        setLoading(true);
        setError(null);
        try {
          const courseData = await fetchCourseById(courseId, userId);
          setCourse(courseData);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };
  
      loadCourse();
    }, [courseId, userId]);
  
    const handleLessonPress = (lessonId: string) => {
      if (!course?.is_enrolled) {
        Alert.alert(
          "Enroll Required",
          "You need to enroll first to access the lessons.",
          [{ text: "OK" }]
        );
        return;
      }
  
      router.push(`/EnrolledCourse/${courseId}/${lessonId}`);
    };
  
    const handleEnrollForFree = () => {
      mutation.mutate(courseId);
    };
  
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
  
    if (!course) {
      return (
        <View style={styles.centered}>
          <Text>Course not found.</Text>
        </View>
      );
    }
  
    return (
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: course.banner_image_url }}
          style={styles.bannerImage}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{course.course_title}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{course.instructor_name}</Text>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{course.course_duration} hours</Text>
            <Ionicons name="speedometer-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{course.difficulty_level}</Text>
          </View>
          <Text style={styles.description}>{course.course_description}</Text>
  
          {course.is_enrolled ? (
            <View style={styles.enrolledContainer}>
              <Text style={styles.enrolledText}>Already Enrolled</Text>
              <Progress.Bar
                progress={course.course_progress / 100}
                width={260}
                color="#6C63FF"
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {course.course_progress}% Completed
              </Text>
            </View>
          ) : course.is_free ? (
            <TouchableOpacity
              style={styles.enrollButton}
              onPress={handleEnrollForFree}
            >
              <Text style={styles.enrollButtonText}>Enroll For Free</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.membershipButton}>
              <Text style={styles.membershipButtonText}>
                Membership ${course.price}/Mon
              </Text>
            </TouchableOpacity>
          )}
  
          <Text style={styles.chaptersTitle}>Chapters</Text>
          {course.lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.lesson_id}
              onPress={() => handleLessonPress(lesson.lesson_id)}
              style={[
                styles.lessonItem,
                { backgroundColor: lessonColors[index % lessonColors.length] },
              ]}
            >
              {/* Green Tick for Completed Lessons */}
              {lesson.is_completed && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="green"
                  style={styles.completedIcon}
                />
              )}
              <View style={styles.lessonContent}>
                <Text style={styles.lessonNumber}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text style={styles.lessonTitle}>{lesson.lesson_title}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      color: "red",
      fontSize: 16,
      textAlign: "center",
      margin: 20,
    },
    bannerImage: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    infoText: {
      marginLeft: 4,
      marginRight: 12,
      color: "#666",
      fontSize: 14,
    },
    description: {
      fontSize: 16,
      marginBottom: 16,
      lineHeight: 24,
    },
    enrollButton: {
      backgroundColor: "#6C63FF",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 24,
    },
    enrollButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    membershipButton: {
      backgroundColor: "#4CAF50",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 24,
    },
    membershipButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    chaptersTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
    },
    lessonItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    lessonNumber: {
      fontSize: 18,
      fontWeight: "bold",
      marginRight: 12,
    },
    lessonTitle: {
      fontSize: 16,
    },
    completedIcon: {
      marginRight: 8,
    },
    lessonContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    progressBar: {
      marginVertical: 8,
    },
    progressText: {
      fontSize: 14,
      color: "#666",
    },
    enrolledContainer: {
      marginBottom: 24,
      alignItems: "center",
    },
    enrolledText: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#4CAF50",
    },
  });
  
  export default CourseDescription;
  