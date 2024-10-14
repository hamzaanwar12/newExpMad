// src/screens/HomeScreen.tsx

import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import tw from "twrnc";
import CourseList from "@/components/courses/CourseList"; // Existing component
import EnrolledCourseList from "@/components/courses/EnrolledCourseList"; // New component

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ExploreScreen() {
  const user = useSelector((state: RootState) => state.user);
  console.log("User : ", user);

  // Reference to CourseList to call the refresh method
  const courseListRef = useRef<{ refresh: () => Promise<void> }>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Handler for pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (courseListRef.current) {
      try {
        await courseListRef.current.refresh();
      } catch (error) {
        console.log("Error refreshing courses:", error);
      }
    }
    setRefreshing(false);
  }, []);

  return (
    <View style={tw`bg-white flex-1`}>
      {/* Header Section */}
      <View style={tw`px-5 py-7 bg-[#6d28d9]`}>
        <View style={tw`flex-row justify-between items-center`}>
          {/* User Info */}
          <View>
            <Text
              style={[tw`text-white text-base`, { fontFamily: "BarlowMedium" }]}
            >
              Welcome,
            </Text>
            <Text
              style={[
                tw`text-white text-lg font-bold`,
                { fontFamily: "BarlowBold" },
              ]}
            >
              {user.username}
            </Text>
          </View>

          {/* Coin/Points with Icon */}
          <View style={tw`flex-row items-center`}>
            <Ionicons name="person-circle-outline" size={40} color="white" />
            <View style={tw`ml-2 flex-row items-center`}>
              <FontAwesome name="star" size={20} color="#facc15" />
              <Text
                style={[
                  tw`text-yellow-400 font-bold text-lg ml-1`,
                  { fontFamily: "BarlowBold" },
                ]}
              >
                3500
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={tw`mt-5`}>
          <View
            style={tw`bg-white rounded-full flex-row items-center px-5 py-3`}
          >
            <TextInput
              placeholder="Search Projects"
              style={[tw`flex-1 text-black`, { fontFamily: "BarlowMedium" }]}
            />
            <View style={tw`ml-2`}>
              <Ionicons name="search" size={24} color="#6d28d9" />
            </View>
          </View>
        </View>
      </View>

      {/* Main Content Section with Pull-to-Refresh */}
      <ScrollView
        style={tw`px-6 py-4`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Available Courses Section */}
        {/* <Text
          style={[
            tw`text-black text-xl font-bold`,
            { fontFamily: "BarlowBold" },
          ]}
        >
          Available Courses
        </Text> 

        <CourseList ref={courseListRef} />
        */}

        {/* Enrolled Courses Section */}
        <Text
          style={[
            tw`text-black text-xl font-bold mt-8`,
            { fontFamily: "BarlowBold" },
          ]}
        >
          Your Enrolled Courses
        </Text>

        <EnrolledCourseList />
      </ScrollView>
    </View>
  );
}
