import { useState,useEffect } from "react";
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
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
    if (!username || !email || !password) {
      setError("Username, Email, and Password are required.");
      return;
    }

    // const saltRounds = 10;
    // const password_hash = await bcrypt.hash(password, saltRounds);

    // Optionally, you can add validation for username, email, and password here

    // **Security Consideration:**
    // Do NOT store raw passwords. If you need to store a password hash, do it on the server side.
    // Here's an example using bcrypt (ensure to handle this securely on the server):
    // const passwordHash = await bcrypt.hash(password, 10);

    // For demonstration, we'll use a dummy hash. **Do not use this in production!**
    // const dummyPasswordHash = "dummy_hash";

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

    // If sign-up is successful, insert user data into the 'users' table
    if (data.user) {
      try {
        const { error: dbError } = await supabase.from("users").insert({
          id: data.user.id, // Supabase Auth user ID
          username: username, // From UI
          email: data.user.email, // From Auth
          password_hash: password, // **Replace with actual hash in production**
          //   password_hash: password_hash, // **Replace with actual hash in production**
          full_name: username, // Dummy value
          role: "student", // Default role
          profile_picture_url: "", // Optional, can be left empty
          bio: "This is a dummy bio.", // Dummy value
          is_subscribed: false, // Default value
          stripe_customer_id: "", // Optional, can be left empty
        });

        if (dbError) {
          console.error("Database Insert Error:", dbError.message);
          setError("Failed to insert user into the database.");
          // Optionally, you can choose to delete the authenticated user if database insertion fails
          await supabase.auth.admin.deleteUser(data.user.id);
        } else {

          dispatch(
            setUser({
              userId: data.user.id,
              username: data.user.user_metadata.full_name || '',
              userEmail: String(data.user.email),
              token: token,
            })
          );
          router.push("/(tabs)");
        }
      } catch (error) {
        console.error("Unexpected Error:", error);
        setError("An unexpected error occurred.");
      }
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
