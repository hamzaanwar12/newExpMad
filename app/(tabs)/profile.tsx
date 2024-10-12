// ProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setUser } from '@/store/userSlice';
import axios from 'axios';
import ImageSelector from '@/components/ImageSelector'; // New ImageSelector component
import { supabase } from '@/supabase/supabase';
// Define environment variables
const CLOUDINARY_UPLOAD_URL: string = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_URL || ''; // Replace with your Cloudinary URL
const CLOUDINARY_UPLOAD_PRESET: string = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''; // Replace with your Upload Preset

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { username, userEmail: email, profile,userId } = user;

  const [profileUrl, setProfileUrl] = useState<string>(profile);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Type for Photo
  interface Photo {
    uri: string;
    type: string;
    name: string;
  }

  // Function to handle image upload to Cloudinary
  const handleImageUpload = async (photo: Photo) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: photo.uri,
      type: photo.type,
      name: photo.name,
    } as any); // Casting to any to satisfy TypeScript
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    // Note: 'cloud_name' is part of the upload URL, not a separate field

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      const result = response.data;
      if (result.secure_url) {
        console.log('Image uploaded successfully:', result.secure_url);
        setProfileUrl(result.secure_url);
        dispatch(setUser({ ...user, profile: result.secure_url }));
    
        // Update the profile picture URL in the database
        const { data, error } = await supabase
          .from('users')
          .update({ profile_picture_url: result.secure_url }) // Assuming 'profile_picture' is the column name
          .eq('id', userId) // Assuming email is unique and used to identify the user
          .select();
    
        if (error) {
          console.error('Database Update Error:', error);
          Alert.alert('Error', 'Could not update profile picture in the database.');
        } else {
          console.log('Profile updated in the database:', data);
        }
    
      } else {
        Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'An error occurred while uploading the image.');
    } finally {
      setIsUploading(false);
      setModalVisible(false);
    }    
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {/* Profile Information */}
      <View style={styles.profileInfo}>
        <View>
          <Image source={{ uri: profileUrl }} style={styles.avatar} />
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="pencil" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          {isUploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{username}</Text>
        <View style={styles.emailContainer}>
          <Ionicons name="mail-outline" size={16} color="#8E8E93" />
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="book-outline" size={24} color="#5D3FD3" />
          <Text style={styles.menuText}>My Course</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#5D3FD3" />
          <Text style={styles.menuText}>Upgrade Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="podium-outline" size={24} color="#5D3FD3" />
          <Text style={styles.menuText}>Ranking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="log-out-outline" size={24} color="#5D3FD3" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Image Selector Modal */}
      <ImageSelector
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={handleImageUpload}
      />
    </View>
  );
};

export default ProfileScreen;

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#6d28d9',
    paddingTop: 90,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -40,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#6d28d9',
    borderRadius: 20,
    padding: 5,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 5,
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#000000',
  },
});
