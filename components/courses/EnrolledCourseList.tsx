// src/components/courses/EnrolledCourseList.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { EnrolledCoursesResponse, EnrolledCourse,fetchEnrolledCourses } from "@/services/AllEnroledCourseService";
import CourseCard from "./CourseCard"; // Reuse existing CourseCard component
import { useSelector } from 'react-redux';
import { RootState } from "@/store/store";

const EnrolledCourseList: React.FC = () => {
  const [courses, setCourses] = useState<EnrolledCoursesResponse>({
    not_started: [],
    in_progress: [],
    completed: [],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user);

  const renderCourse = ({ item }: { item: EnrolledCourse }) => {
    return <CourseCard course={item} />;
  };

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const data = await fetchEnrolledCourses(user.userId||""); // Ensure user.id is the correct UUID
        console.log("Enrolled Courses Data:", data);
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user.userId) {
      getEnrolledCourses();
    } else {
      setError("User ID not found.");
      setLoading(false);
    }
  }, [user.userId]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.center} />
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Not Started Courses */}
      <Text style={styles.categoryTitle}>Not Started</Text>
      <FlatList
        data={courses.not_started}
        renderItem={renderCourse}
        keyExtractor={(item) => item.course_id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* In Progress Courses */}
      <Text style={styles.categoryTitle}>In Progress</Text>
      <FlatList
        data={courses.in_progress}
        renderItem={renderCourse}
        keyExtractor={(item) => item.course_id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Completed Courses */}
      <Text style={styles.categoryTitle}>Completed</Text>
      <FlatList
        data={courses.completed}
        renderItem={renderCourse}
        keyExtractor={(item) => item.course_id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default EnrolledCourseList;
