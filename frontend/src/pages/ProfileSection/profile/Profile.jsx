import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserInfo } from "../../../redux/features/user/userSlice";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./ProfileStyles";
import moment from "moment"; // Pour formater la date

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let userId = user?._id;

        if (!userId) {
          const storedUser = await AsyncStorage.getItem("user");
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          userId = parsedUser?._id;
        }

        if (userId) {
          dispatch(fetchUserInfo(userId));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, [dispatch, user]);

  const handleUpdateUser = () => {
    navigation.navigate("ProfileEdit");
  };

  const currentDate = moment().format("dddd, DD MMMM"); // Format de la date

  const renderProfileIcon = () => {
    if (userInfo.imageUrl) {
      return (
        <Image
          source={{ uri: userInfo.imageUrl }}
          style={styles.profileImage}
        />
      );
    } else {
      switch (userInfo.gender) {
        case "Homme":
          return <Icon name="male" size={100} color="#888" />;
        case "Femme":
          return <Icon name="female" size={100} color="#888" />;
        case "Autre":
          return <Icon name="genderless" size={100} color="#888" />;
        default:
          return <Icon name="user-circle" size={100} color="#888" />;
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              {renderProfileIcon()}
              <Text style={styles.welcomeText}>
                Hello {userInfo.firstName}!
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleUpdateUser}
              style={styles.editIconContainer}
            >
              <Icon name="edit" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.dateText}>{currentDate}</Text>
          <Text style={styles.kcalText}>1 883 Kcal</Text>
          <Text style={styles.label}>Total Kilocalories</Text>
          {/* Afficher d'autres informations utilisateur ici */}
        </>
      ) : (
        <Text style={styles.errorText}>No user information available.</Text>
      )}
    </View>
  );
};

export default Profile;
