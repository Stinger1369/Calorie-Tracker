import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./ProfileHeaderStyle";

const ProfileHeader = ({ userInfo, currentDate, onEditPress }) => {
  const renderProfileIcon = () => {
    if (userInfo?.imageUrl) {
      return (
        <Image
          source={{ uri: userInfo.imageUrl }}
          style={styles.profileImage}
        />
      );
    } else {
      switch (userInfo?.gender) {
        case "male":
          return <Icon name="male" size={50} color="#888" />;
        case "female":
          return <Icon name="female" size={50} color="#888" />;
        case "other":
          return <Icon name="genderless" size={50} color="#888" />;
        default:
          return <Icon name="user-circle" size={50} color="#888" />;
      }
    }
  };

  return (
    <View style={styles.profileHeader}>
      <View style={styles.profileInfo}>
        {renderProfileIcon()}
        <View style={styles.greetingContainer}>
          <Text style={styles.welcomeText}>Hello {userInfo.firstName}!</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onEditPress} style={styles.editIconContainer}>
        <Icon name="edit" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
