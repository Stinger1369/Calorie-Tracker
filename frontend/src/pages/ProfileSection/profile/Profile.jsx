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
import { restoreToken } from "../../../redux/features/auth/authSlice";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./ProfileStyles";
import moment from "moment";
import { calculateIMC } from "./Imc/calculateIMC"; // Importer la fonction IMC

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let userId = user?._id;
        let storedToken = token;

        if (!userId || !storedToken) {
          const storedUser = await AsyncStorage.getItem("user");
          storedToken = await AsyncStorage.getItem("token");

          if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser?._id;

            // Restaurer l'état de l'utilisateur et du token dans Redux
            dispatch(restoreToken({ user: parsedUser, token: storedToken }));
          }
        }

        if (userId) {
          dispatch(fetchUserInfo(userId));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, [dispatch, user, token]);

  const handleUpdateUser = () => {
    navigation.navigate("ProfileEdit");
  };

  const handleIMCPress = () => {
    navigation.navigate("IMCDetails", { imc: userInfo.bmi });
  };

  const currentDate = moment().format("dddd, DD MMMM");

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

  const imc = userInfo.bmi || calculateIMC(userInfo.weight, userInfo.height);

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
          {/* Afficher les informations du profil utilisateur, y compris l'IMC */}
          <TouchableOpacity onPress={handleIMCPress}>
            <Text style={styles.label}>
              Taille: {userInfo.height} cm - Poids: {userInfo.weight} kg - IMC:{" "}
              {imc}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>No user information available.</Text>
      )}
    </View>
  );
};

export default Profile;
