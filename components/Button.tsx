import React from "react";
import { Text, Pressable } from "react-native";
import tw from "twrnc"; // Importing Tailwind for React Native

interface ButtonProps {
  title: string;
  action?: () => void; // Optional action function
}

const Button: React.FC<ButtonProps> = ({ title, action }) => {
  return (
    <Pressable style={tw`rounded-3xl min-w-[250px] justify-center items-center py-2  bg-blue-600`} onPress={action}>
      <Text style={tw`text-white font-bold text-lg`}>
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;
