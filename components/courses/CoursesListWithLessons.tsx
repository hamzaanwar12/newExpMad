import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchAllCoursesWithLessons } from '@/services/courseService';
import { CourseWithLessons } from '@/types';

const CourseListWithLessons: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchAllCoursesWithLessons();
        console.log(data);  // Check the structure of data
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
    return <ActivityIndicator size="large" color="#0000ff" style={styles.center} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No courses available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {['Basic', 'Intermediate', 'Advanced'].map(level => (
        <View key={level}>
          <Text style={styles.levelTitle}>{level} Courses</Text>
          <FlatList
            data={courses.filter(course => course.difficulty_level === level)}
            keyExtractor={item => item.course_id}
            renderItem={({ item }) => (
              <View style={styles.courseItem}>
                <Text style={styles.title}>{item.course_title}</Text>
                <Text style={styles.instructor}>Instructor: {item.instructor_name}</Text>
                <Text style={styles.description}>{item.course_description}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <Text style={styles.lessonsTitle}>Lessons:</Text>
                <FlatList
                  data={item.lessons}  // Ensure this is an array
                  keyExtractor={lesson => lesson.lesson_id}
                  renderItem={({ item: lesson }) => (
                    <View style={styles.lessonItem}>
                      <Text style={styles.lessonTitle}>{lesson.lesson_title}</Text>
                      <Text style={styles.lessonDuration}>Duration: {lesson.lesson_duration} mins</Text>
                    </View>
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  courseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructor: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginTop: 8,
  },
  lessonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  lessonItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  lessonDuration: {
    fontSize: 12,
    color: '#666',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CourseListWithLessons;
