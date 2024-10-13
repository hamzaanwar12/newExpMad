// src/components/CourseList.tsx

import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Dimensions,
} from "react-native";
import { fetchPaginatedCourses } from "@/services/lyoutCourseService";
import CourseCard, { Course, CoursesResponse } from "./CourseCard";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.75; // 75% of screen width

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<CoursesResponse>({
    basic: [],
    intermediate: [],
    advanced: [],
  });

  // Separate page states for each category
  const [pageBasic, setPageBasic] = useState<number>(1);
  const [pageIntermediate, setPageIntermediate] = useState<number>(1);
  const [pageAdvanced, setPageAdvanced] = useState<number>(1);

  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMoreBasic, setLoadingMoreBasic] = useState<boolean>(false);
  const [loadingMoreIntermediate, setLoadingMoreIntermediate] = useState<boolean>(false);
  const [loadingMoreAdvanced, setLoadingMoreAdvanced] = useState<boolean>(false);

  // Flags to determine if more courses are available for each category
  const [hasMoreBasic, setHasMoreBasic] = useState<boolean>(true);
  const [hasMoreIntermediate, setHasMoreIntermediate] = useState<boolean>(true);
  const [hasMoreAdvanced, setHasMoreAdvanced] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const renderCourse = ({ item }: ListRenderItemInfo<Course>) => {
    return <CourseCard course={item} />;
  };

  // Fetch courses based on the current page and category
  const getCourses = async (category: keyof CoursesResponse, currentPage: number) => {
    try {
      console.log(`Fetching ${category} courses for page:`, currentPage);
      const data = await fetchPaginatedCourses(currentPage);
      console.log(data); // Check the structure of data

      const fetchedCourses = data[category];

      if (fetchedCourses.length === 0) {
        // No more data to fetch for this category
        if (category === "basic") setHasMoreBasic(false);
        if (category === "intermediate") setHasMoreIntermediate(false);
        if (category === "advanced") setHasMoreAdvanced(false);
      } else {
        // Append new courses to existing lists
        setCourses((prevCourses) => ({
          ...prevCourses,
          [category]: [...prevCourses[category], ...fetchedCourses],
        }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (category === "basic") setLoadingMoreBasic(false);
      if (category === "intermediate") setLoadingMoreIntermediate(false);
      if (category === "advanced") setLoadingMoreAdvanced(false);
    }
  };

  useEffect(() => {
    // Fetch initial courses for all categories
    const fetchInitialCourses = async () => {
      await Promise.all([
        getCourses("basic", pageBasic),
        getCourses("intermediate", pageIntermediate),
        getCourses("advanced", pageAdvanced),
      ]);
    };

    fetchInitialCourses();
  }, []);

  // Handlers for loading more courses
  const handleLoadMoreBasic = () => {
    if (hasMoreBasic && !loadingMoreBasic && !loading) {
      setLoadingMoreBasic(true);
      setPageBasic((prevPage) => prevPage + 1);
      getCourses("basic", pageBasic + 1);
    }
  };

  const handleLoadMoreIntermediate = () => {
    if (hasMoreIntermediate && !loadingMoreIntermediate && !loading) {
      setLoadingMoreIntermediate(true);
      setPageIntermediate((prevPage) => prevPage + 1);
      getCourses("intermediate", pageIntermediate + 1);
    }
  };

  const handleLoadMoreAdvanced = () => {
    if (hasMoreAdvanced && !loadingMoreAdvanced && !loading) {
      setLoadingMoreAdvanced(true);
      setPageAdvanced((prevPage) => prevPage + 1);
      getCourses("advanced", pageAdvanced + 1);
    }
  };

  // Render footer component for FlatList
  const renderFooter = (category: keyof CoursesResponse) => {
    let isLoadingMore: boolean;
    let hasMore: boolean;

    if (category === "basic") {
      isLoadingMore = loadingMoreBasic;
      hasMore = hasMoreBasic;
    } else if (category === "intermediate") {
      isLoadingMore = loadingMoreIntermediate;
      hasMore = hasMoreIntermediate;
    } else {
      isLoadingMore = loadingMoreAdvanced;
      hasMore = hasMoreAdvanced;
    }

    if (isLoadingMore) {
      return <ActivityIndicator size="small" color="#0000ff" style={{ margin: 10 }} />;
    }
    if (!hasMore) {
      return (
        <View style={[styles.footer, { width: cardWidth }]}>
          <Text style={styles.footerText}>All courses have been fetched.</Text>
        </View>
      );
    }
    return null;
  };

  if (loading && pageBasic === 1 && pageIntermediate === 1 && pageAdvanced === 1) {
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
        keyExtractor={(item) => `${item.course_id}-basic`}
        horizontal
        showsHorizontalScrollIndicator={false}
        onEndReached={handleLoadMoreBasic}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter("basic")}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Intermediate Courses */}
      <Text style={styles.categoryTitle}>Intermediate Courses</Text>
      <FlatList
        data={courses.intermediate}
        renderItem={renderCourse}
        keyExtractor={(item) => `${item.course_id}-intermediate`}
        horizontal
        showsHorizontalScrollIndicator={false}
        onEndReached={handleLoadMoreIntermediate}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter("intermediate")}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Advanced Courses */}
      <Text style={styles.categoryTitle}>Advanced Courses</Text>
      <FlatList
        data={courses.advanced}
        renderItem={renderCourse}
        keyExtractor={(item) => `${item.course_id}-advanced`}
        horizontal
        showsHorizontalScrollIndicator={false}
        onEndReached={handleLoadMoreAdvanced}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter("advanced")}
        contentContainerStyle={styles.flatListContent}
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
  footer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#555",
  },
  flatListContent: {
    // Ensures proper alignment of items including footer
    alignItems: "center",
  },
});

export default CourseList;
