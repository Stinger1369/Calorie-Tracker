// components/Section.jsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../homeStyles';

const Section = ({ iconType, iconName, label, onPress, style }) => {
  const IconComponent = iconType === 'FontAwesome' ? FontAwesome : iconType === 'FontAwesome5' ? FontAwesome5 : MaterialCommunityIcons;

  return (
    <TouchableOpacity style={[styles.section, style]} onPress={onPress}>
      <IconComponent name={iconName} size={40} color="#ffffff" />
      <Text style={styles.sectionText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Section;
