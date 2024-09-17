// components/Header.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../homeStyles';

const Header = ({ userInfo, currentDate, openModal }) => {
  const renderProfileIcon = () => {
    if (userInfo?.imageUrl) {
      return <Image source={{ uri: userInfo.imageUrl }} style={styles.profileImage} />;
    } else {
      switch (userInfo?.gender) {
        case "male":
          return <FontAwesome name="male" size={50} color="#888" />;
        case "female":
          return <FontAwesome name="female" size={50} color="#888" />;
        case "other":
          return <FontAwesome name="genderless" size={50} color="#888" />;
        default:
          return <FontAwesome name="user-circle" size={50} color="#888" />;
      }
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.profileInfoContainer}>
        {renderProfileIcon()}
        <View style={styles.greetingContainer}>
          <Text style={styles.welcomeText}>Hello {userInfo?.firstName}!</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={openModal}>
        <MaterialCommunityIcons name="logout" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
