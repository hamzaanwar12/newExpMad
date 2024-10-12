import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/supabase/supabase"; // Adjust based on your Supabase config
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

// If you decide to use a hashing library, install and import it here
// import bcrypt from 'bcryptjs'; // Example: bcryptjs for hashing

const SignUp = () => {
  const [username, setUsername] = useState(""); // New state for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    // Basic input validation
    if (!username || !email || !password) {
      setError("Username, Email, and Password are required.");
      return;
    }

    try {
      // Sign up the user with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Sign Up Error:", authError.message);
        setError(authError.message);
        return;
      }

      if (data.user) {
        // Insert user data into the 'users' table
        const { data: insertedUser, error: dbError } = await supabase
          .from("users")
          .insert({
            id: data.user.id, // Supabase Auth user ID
            username: username, // From UI
            email: data.user.email, // From Auth
            // password_hash: password, // **Remove this field for security**
            full_name: username, // Dummy value
            role: "student", // Default role
            profile_picture_url:
              "https://res.cloudinary.com/dmjvyjevz/image/upload/v1728242973/307ce493-b254-4b2d-8ba4-d12c080d6651_k9ziq4.jpg", // Optional, can be left empty
            bio: "This is a dummy bio.", // Dummy value
            is_subscribed: false, // Default value
            stripe_customer_id: "", // Optional, can be left empty
          })
          .select()
          .single(); // Fetch the inserted row

        if (dbError) {
          console.error("Database Insert Error:", dbError.message);
          setError("Failed to insert user into the database.");

          // Sign out the user to maintain data integrity
          await supabase.auth.signOut();
          return;
        }

        // Retrieve the session token
        const session = data.session;
        const token = session?.access_token;

        if (!token) {
          setError("Failed to retrieve session token.");
          return;
        }

        // Store the token in AsyncStorage for persistence
        try {
          await AsyncStorage.setItem("userToken", token);
        } catch (e) {
          console.error("Failed to save token:", e);
          setError("Failed to save session token.");
          return;
        }
        // Dispatch user data to Redux store
        dispatch(
          setUser({
            userId: data.user.id,
            username: insertedUser.username,
            userEmail: insertedUser.email,
            token: token,
            profile: insertedUser.profile_picture_url || "",
            isSubscribed: insertedUser.is_subscribed || false,
          })
        );

        // Navigate to the desired route
        router.push("/(tabs)");
      } else {
        setError("User data not available after sign-up.");
      }
    } catch (error: any) {
      console.error("Unexpected Error:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

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

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="lock"
          size={20}
          color="#6d28d9"
          style={styles.icon}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={styles.input}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={20}
            color="#6d28d9"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Additional Options */}
      <View style={styles.optionsContainer}>
        <View style={styles.checkboxContainer}>
          {/* <CheckBox
            value={keepSignedIn}
            onValueChange={setKeepSignedIn}
            tintColors={{ true: "#6d28d9", false: "#6d28d9" }}
          /> */}
          <Text style={styles.checkboxLabel}>Keep me signed in</Text>
        </View>
        {/* Jugaar for now */}
        {/* <TouchableOpacity onPress={() => router.push("/auth/ForgotPassword")}> */}
        <TouchableOpacity onPress={() => router.push("/auth/ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Sign Up Button */}
      <TouchableOpacity
        onPress={handleSignUp}
        style={styles.signUpButton}
        activeOpacity={0.7}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity onPress={() => router.push("/auth/Login")}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
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
  eyeIcon: {
    marginLeft: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "white",
    fontSize: 14,
  },
  forgotPassword: {
    color: "white",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  signUpButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    borderColor: "#6d28d9",
    borderWidth: 1,
    marginBottom: 15,
  },
  signUpButtonText: {
    color: "#6d28d9",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default SignUp;
