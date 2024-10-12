import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch,useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import { setUser } from "@/store/userSlice";
import { useState } from 'react';


const ProfileScreen = () => {
  const user = useSelector((state: RootState) => state.user);
  const { userId,username, userEmail:email, profile,isSubscribed } = user;
  const [profileUrl,serProfileUrl] = useState(profile);
  console.log("User : ",user)
  console.log("Profile : ",profile)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.profileInfo}>
        <Image source={{ uri: profileUrl }} style={styles.avatar} />
        <Text style={styles.name}>{username}</Text>
        <View style={styles.emailContainer}>
          <Ionicons name="mail-outline" size={16} color="#8E8E93" />
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
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
    </View>
  );
};

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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 0,
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

export default ProfileScreen;