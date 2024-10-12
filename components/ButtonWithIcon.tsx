// ButtonWithIcon.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, GestureResponderEvent } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


interface ButtonWithIconProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap; // Ensures only valid Ionicons are used
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({ icon, text, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.modalButton, style]} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={24} color="#FFFFFF" style={styles.modalIcon} />
      <Text style={styles.modalButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6d28d9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ButtonWithIcon;
