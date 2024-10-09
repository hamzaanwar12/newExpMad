// src/components/CourseList.tsx

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { fetchPaginatedCourses } from "@/services/lyoutCourseService";
import CourseCard, { Course, CoursesResponse } from "./CourseCard";

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<CoursesResponse>({
    basic: [],
    intermediate: [],
    advanced: [],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const renderCourse = ({ item }: { item: Course }) => {
    return <CourseCard course={item} />;
  };

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchPaginatedCourses();
        console.log(data); // Check the structure of data
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

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
      {/* Basic Courses */}
      <Text style={styles.categoryTitle}>Basic Courses</Text>
      <FlatList
        data={courses.basic}
        renderItem={renderCourse}
        keyExtractor={(item) => item.course_title}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Intermediate Courses */}
      <Text style={styles.categoryTitle}>Intermediate Courses</Text>
      <FlatList
        data={courses.intermediate}
        renderItem={renderCourse}
        keyExtractor={(item) => item.course_title}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Advanced Courses */}
      <Text style={styles.categoryTitle}>Advanced Courses</Text>
      <FlatList
        data={courses.advanced}
        renderItem={renderCourse}
        keyExtractor={(item) => item.course_title}
        horizontal
        // showsHorizontalScrollIndicator={false}
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

export default CourseList;
