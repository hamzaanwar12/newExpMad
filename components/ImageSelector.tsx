// components/ImageSelector.tsx

import React from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ButtonWithIcon from './ButtonWithIcon';
import * as ImagePicker from 'expo-image-picker';

interface Photo {
  uri: string;
  type: string;
  name: string;
}

interface ImageSelectorProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (photo: Photo) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ visible, onClose, onImageSelected }) => {
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  // Function to select image from gallery
  const selectImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access the photo library is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const asset = pickerResult.assets[0];
        const { uri } = asset;
        const type = asset.type === 'image' ? 'image/jpeg' : 'image/png';
        const name = `profile_${Date.now()}.jpg`; // Generate a unique filename

        const photo: Photo = { uri, type, name };
        console.log('Selected Image:', photo);
        onImageSelected(photo);
      } else {
        console.log('Image selection cancelled or assets undefined');
      }
    } catch (error) {
      console.error('Gallery Selection Error:', error);
      Alert.alert('Error', 'An error occurred while selecting the image.');
    }
  };

  // Function to take photo with camera
  const takePhotoWithCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access the camera is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const asset = pickerResult.assets[0];
        const { uri } = asset;
        const type = asset.type === 'image' ? 'image/jpeg' : 'image/png';
        const name = `profile_${Date.now()}.jpg`; // Generate a unique filename

        const photo: Photo = { uri, type, name };
        console.log('Captured Image:', photo);
        onImageSelected(photo);
      } else {
        console.log('Camera capture cancelled or assets undefined');
      }
    } catch (error) {
      console.error('Camera Error:', error);
      Alert.alert('Error', 'An error occurred while taking the photo.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalView}>
          <ButtonWithIcon
            icon="camera-burst"
            text="Camera"
            onPress={takePhotoWithCamera}
          />
          <ButtonWithIcon
            icon="view-gallery"
            text="Gallery"
            onPress={selectImageFromGallery}
          />
          <ButtonWithIcon
            icon="cancel"
            text="Cancel"
            onPress={onClose}
            style={styles.cancelButton}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
});

export default ImageSelector;
