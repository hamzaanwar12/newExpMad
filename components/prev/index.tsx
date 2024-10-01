import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native'; // Import Pressable and Alert
import { Link } from 'expo-router';
import tw from 'twrnc';
// import { EXPO_PUBLIC_API_URL } from '@env'; // Correct import

const Index = () => {
  // Function to handle Pressable press
  const handlePress = () => {
    console.log('Pressable pressed');
    // Display an alert with the API URL
    // Alert.alert('API URL', EXPO_PUBLIC_API_URL);
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 px-4`}>
      <Text style={tw`text-2xl font-bold mb-6 text-center`}>
        Welcome to the Index Screen
      </Text>

      {/* Pressable Component */}
      <Pressable
        onPress={handlePress}
        style={({ pressed }) =>
          tw`px-6 py-3 rounded-md ${
            pressed ? 'bg-blue-400' : 'bg-blue-500'
          }`
        }
      >
        {({ pressed }) => (
          <Text style={tw`text-white text-lg text-center`}>
            {pressed ? 'Releasing...' : 'Show API URL'}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default Index;
