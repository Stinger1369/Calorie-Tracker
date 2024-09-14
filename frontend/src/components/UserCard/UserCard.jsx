import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './UserCardStyles';

const UserCard = ({ user, onPress }) => {
  const renderProfileImage = () => {
    if (user.imageUrl) {
      return <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />;
    } else {
      switch (user.gender) {
        case "male":
          return <FontAwesome name="male" size={50} color="#888" />;
        case "female":
          return <FontAwesome name="female" size={50} color="#888" />;
        default:
          return <FontAwesome name="user-circle" size={50} color="#888" />;
      }
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.profileContainer}>
        {renderProfileImage()}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
