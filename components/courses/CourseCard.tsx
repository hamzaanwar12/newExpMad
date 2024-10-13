// src/components/CourseCard.tsx

import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
// import { StackNavigationProp } from '@react-navigation/stack';
import { EnrolledCourse } from "@/services/AllEnroledCourseService";



export interface Course {
  course_id: string;
  course_title: string;
  course_description: string;
  instructor_name: string;
  course_duration: string;
  banner_image_url: string;
  lesson_length: number;
  price: number; // Added price
}

export interface CoursesResponse {
  basic: Course[];
  intermediate: Course[];
  advanced: Course[];
}

interface CourseCardProps {
  course: Course | EnrolledCourse; // Use the EnrolledCourse type
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();
  const isFree = course.price === 0;
  const courseID = course.course_id;

  const handlePress = () => {
    console.log("Course ID:", courseID);
    router.push(`/CourseDescription/${courseID}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: course.banner_image_url }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {course.course_title}
        </Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {course.course_description}
        </Text>
        <Text style={styles.duration}>
          Duration: {course.course_duration} hours
        </Text>
        <Text style={styles.instructor} numberOfLines={1} ellipsizeMode="tail">
          Instructor: {course.instructor_name}
        </Text>
        <View style={styles.priceContainer}>
          <View style={[styles.tag, isFree ? styles.freeTag : styles.paidTag]}>
            <Text style={styles.tagText}>{isFree ? "Free" : "Paid"}</Text>
          </View>
          {!isFree && (
            <Text style={styles.price}>${course.price?.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");
const cardWidth = width * 0.75; // 75% of screen width

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  contentContainer: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  instructor: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  freeTag: {
    backgroundColor: "#4CAF50",
  },
  paidTag: {
    backgroundColor: "#FF9800",
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e91e63",
  },
});

export default CourseCard;
