import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust based on your store configuration
import { clearUser } from "@/store/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    // Optional: Add a confirmation alert
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setError("");
            try {
              // Remove token from AsyncStorage
              await AsyncStorage.removeItem("userToken");
              // Clear user from Redux store
              dispatch(clearUser());
              // Navigate to Login screen
              router.push("/auth/Login");
            } catch (err: any) {
              console.error("Unexpected Error:", err);
              setError("An unexpected error occurred during logout.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>

      {/* Display User Information */}
      <View style={styles.userInfoContainer}>
        <Ionicons name="person-circle" size={80} color="#6d28d9" />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.userEmail}</Text>
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutButton}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#6d28d9" />
        ) : (
          <Text style={styles.logoutButtonText}>Logout</Text>
        )}
      </TouchableOpacity>

      {/* Optional: Navigate to Settings or Other Screens */}
      <TouchableOpacity onPress={() => router.push("/(tabs)")}>
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6d28d9",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
  },
  userInfoContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6d28d9",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    borderColor: "#6d28d9",
    borderWidth: 1,
    marginBottom: 15,
  },
  logoutButtonText: {
    color: "#6d28d9",
    fontWeight: "bold",
    fontSize: 16,
  },
  backText: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default Logout;
