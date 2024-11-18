// app/Index.tsx
import { useRef, useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, BounceIn } from "react-native-reanimated"; // Importing the animated library
import tw from "twrnc"; // Importing Tailwind for React Native
import Button from "@/components/Button";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import { setUser } from "@/store/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/supabase/supabase"; // Adjust based on your Supabase config



const Index: React.FC = () => {



  const animation = useRef<LottieView>(null);
  const dispatch = useDispatch()
  // Access the token from the Redux store
  const user = useSelector((state: RootState) => state.user);
  // console.log("User : ",user)
  // useEffect(() => {
  //   console.log('Token:', token);
  // }, [token]);



  
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
  

              console.log("User Data:", userData);
              
            if (userData && !userError) {
              dispatch(
                setUser({
                  userId: userId,
                  username: userData.username || "",
                  userEmail: data.user.email || "",
                  token: token,
                  profile: userData.profile_picture_url,
                  isSubscribed: userData.is_subscribed,
                  
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
  


  console.log(process.env.EXPO_PUBLIC_SUPABASE_URL);  
  console.log(process.env.EXPO_PUBLIC_SUPABASE_API_KEY);  
  
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={tw`w-full`}
      >
        <LottieView
          ref={animation}
          source={require("../assets/animations/learner.json")}
          autoPlay
          loop
          style={{ width: 400, height: 400 }}
        />

        <Animated.View
          entering={FadeInDown.duration(300).delay(400).springify()}
          style={tw``}
        >
          <Text
            style={[
              tw`mt-7 text-center text-4xl font-extrabold`,
              { fontFamily: "BarlowExtraBold" },
            ]}
          >
            Discover and improve your skills.
          </Text>

          <Text
            style={[
              tw`text-center mt-2 text-lg`,
              { fontFamily: "BarlowBold" },
            ]}
          >
            Learn from the best courses and tutorials.
          </Text>
        </Animated.View>

        {/* Button with scaling animation */}
        <View style={tw`mt-10 p-2 px-7`}>
          <Animated.View entering={BounceIn.duration(300).delay(600)}>
            <Button title="Get Started" action={() => router.push("/auth/Login")} />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Index;
