import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/supabase/supabase"; // Adjust based on your Supabase config
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          // Fetch user data using the token
          const { data, error } = await supabase.auth.getUser(token);
          if (data.user && !error) {
            const userId = data.user.id;
  
            // Fetch additional user details
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq("id", userId)
              .single();
  
            if (userData && !userError) {
              dispatch(
                setUser({
                  userId: userId,
                  username: userData.userName || "",
                  userEmail: data.user.email || "",
                  token: token,
                  profile: userData.profile_picture_url,
                  // ... other fields
                })
              );
              router.push("/(tabs)"); // Redirect to Home page
            } else {
              // Token invalid or user details not found
              await AsyncStorage.removeItem("userToken");
            }
          } else {
            // Token invalid or user not found
            await AsyncStorage.removeItem("userToken");
          }
        }
      } catch (e) {
        console.error("Failed to load token:", e);
      }
    };
  
    checkToken();
  }, [dispatch]);
  

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }
  
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (authError) {
      console.error("Login Error:", authError.message);
      setError(authError.message);
    } else if (data.session) {
      console.log("Login successful");
  
      const userId = data.session.user.id;
      const token = data.session.access_token;
  
      // Fetch additional user details from the 'users' table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*") // Select specific fields if needed, e.g., "full_name, avatar_url"
        .eq("id", userId)
        .single();
  
      if (userError) {
        console.error("Error fetching user details:", userError.message);
        setError("Failed to fetch user details.");
        return;
      }
  
      // Dispatch user data to Redux store
      dispatch(
        setUser({
          userId: userId,
          username: userData.username || "",
          userEmail: data.session.user.email || "",
          token: token,
          profile: userData.profile_picture_url,
        })
      );
  
      // Store token in AsyncStorage for persistence
      try {
        await AsyncStorage.setItem("userToken", token);
      } catch (e) {
        console.error("Failed to save token:", e);
      }
  
      router.push("/(tabs)"); // Redirect to Home page on success
    } else {
      setError("Unexpected error occurred.");
    }
  };
  

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6d28d9",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "white",
          marginBottom: 20,
        }}
      >
        Login
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          backgroundColor: "white",
          borderRadius: 5,
          padding: 10,
          width: "100%",
          marginBottom: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 3.5,
          elevation: 5,
        }}
      />
      <View style={{ position: "relative", width: "100%", marginBottom: 10 }}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            backgroundColor: "white",
            borderRadius: 5,
            padding: 10,
            width: "100%",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 3.5,
            elevation: 5,
          }}
        />
        <TouchableOpacity
          style={{ position: "absolute", right: 10, top: 10 }}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color="#6d28d9"
          />
        </TouchableOpacity>
      </View>
      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "white",
          padding: 12,
          borderRadius: 5,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#6d28d9",
          borderWidth: 1,
        }}
        activeOpacity={0.7}
      >
        <Text style={{ color: "#6d28d9", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/SignUp")}>
        <Text style={{ marginTop: 15, color: "white" }}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
