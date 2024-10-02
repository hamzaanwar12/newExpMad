import React, { useRef } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, BounceIn } from "react-native-reanimated"; // Importing the animated library
import tw from "twrnc"; // Importing Tailwind for React Native
import Button from "@/components/Button";
import { router } from "expo-router";
import LottieView from "lottie-react-native";

const Index: React.FC = () => {
  const animation = useRef<LottieView>(null);

  return (
    <View style={tw`flex-1 justify-center items-center bg-white `}>
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
              tw` mt-7 text-center text-4xl font-extrabold`,
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
        <View style={tw`mt-10 p-2 px-7` }>
          <Animated.View entering={BounceIn.duration(300).delay(600)}>
            <Button title="Get Started" action={() => router.push("/(tabs)")} />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Index;
