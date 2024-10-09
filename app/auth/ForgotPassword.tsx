import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/supabase/supabase"; // Adjust based on your Supabase config
import { router } from "expo-router";

const ForgotPassword = () => {
  const [username, setUsername] = useState(""); // New state for username
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async () => {
    if (!username || !email) {
      setError("Username and Email are required.");
      return;
    }

    // Verify that the username and email match a user in the 'users' table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("email", email)
      .single();

    if (userError || !user) {
      console.error("User Verification Error:", userError ? userError.message : "User not found.");
      setError("Invalid username or email.");
      return;
    }

    // Send password reset email using Supabase Auth
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "yourapp://reset-password", // Replace with your app's redirect URL
    });

    if (resetError) {
      console.error("Password Reset Error:", resetError.message);
      setError("Failed to send password reset email.");
    } else {
      setSuccess("Password reset email has been sent. Please check your inbox.");
      setError("");
      // Optionally, navigate the user or perform other actions
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#6d28d9" style={styles.icon} />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#6d28d9" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Success Message */}
      {success ? <Text style={styles.successText}>{success}</Text> : null}

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Set New Password Button */}
      <TouchableOpacity
        onPress={handleForgotPassword}
        style={styles.resetButton}
        activeOpacity={0.7}
      >
        <Text style={styles.resetButtonText}>Set New Password</Text>
      </TouchableOpacity>

      {/* Navigation Links */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={() => router.push("/auth/Login")}>
          <Text style={styles.navigationText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.navigationSeparator}> | </Text>
        <TouchableOpacity onPress={() => router.push("/auth/SignUp")}>
          <Text style={styles.navigationText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  resetButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    borderColor: "#6d28d9",
    borderWidth: 1,
    marginBottom: 15,
  },
  resetButtonText: {
    color: "#6d28d9",
    fontWeight: "bold",
    fontSize: 16,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  navigationText: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  navigationSeparator: {
    color: "white",
    fontSize: 16,
    marginHorizontal: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  successText: {
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ForgotPassword;
