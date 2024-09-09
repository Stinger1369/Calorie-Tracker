import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserInfo } from "../../../redux/features/user/userSlice";
import { restoreToken } from "../../../redux/features/auth/authSlice";
import styles from "./ProfileStyles";
import moment from "moment";
import ProfileHeader from "./ProfileComponents/ProfileHeader/ProfileHeader";
import InfoCards from "./ProfileComponents/InfoCards/InfoCards";
import ActionCard from "./ProfileComponents/ActionCard/ActionCard";

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

      console.log("Stored token:", storedToken); // Log pour vérifier

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser?._id;

        dispatch(restoreToken({ user: parsedUser, token: storedToken }));
      }
    }

    if (userId && storedToken) {
      dispatch(fetchUserInfo(userId));
    }
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
};


    loadUserData();
  }, [dispatch, user, token]);

  useEffect(() => {
    if (error) {
      console.error("Error loading user data:", error);
    }
  }, [error]);

  const handleUpdateUser = () => {
    navigation.navigate("ProfileEdit");
  };

  const handleIMCPress = () => {
    if (userInfo && userInfo.bmi) {
      const imc = userInfo.bmi;
      if (imc < 18.5) {
        navigation.navigate("Insuffisant");
      } else if (imc >= 18.5 && imc < 24.9) {
        navigation.navigate("Normal");
      } else if (imc >= 25 && imc < 29.9) {
        navigation.navigate("Surpoids");
      } else {
        navigation.navigate("Obesite");
      }
    } else {
      console.warn("User BMI data is not available.");
    }
  };

  const handleExerciceApiPress = () => {
    if (userInfo && userInfo.bmi) {
      const imc = userInfo.bmi;
      if (imc < 18.5) {
        navigation.navigate("InsuffisantExercice");
      } else if (imc >= 18.5 && imc < 24.9) {
        navigation.navigate("NormalExercice");
      } else if (imc >= 25 && imc < 29.9) {
        navigation.navigate("SurpoidsExercice");
      } else {
        navigation.navigate("ObesiteExercice");
      }
    } else {
      console.warn("User BMI data is not available for exercise.");
    }
  };

  const currentDate = moment().format("dddd, DD MMMM");

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

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user information available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader
        userInfo={userInfo}
        currentDate={currentDate}
        onEditPress={handleUpdateUser}
      />
      <InfoCards userInfo={userInfo} />
      <ActionCard userInfo={userInfo} onIMCPress={handleIMCPress} />

      <TouchableOpacity style={styles.button} onPress={handleExerciceApiPress}>
        <Text style={styles.buttonText}>Voir les exercices recommandés</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
