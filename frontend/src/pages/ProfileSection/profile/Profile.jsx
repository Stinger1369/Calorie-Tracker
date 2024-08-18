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

          if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser?._id;

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
    }
  };

  const handleExerciceApiPress = () => {
    if (userInfo && userInfo.bmi) {
      const imc = userInfo.bmi;
      if (imc < 18.5) {
        navigation.navigate("InsuffisantExercice"); // Navigate to exercises for underweight
      } else if (imc >= 18.5 && imc < 24.9) {
        navigation.navigate("NormalExercice"); // Navigate to exercises for normal weight
      } else if (imc >= 25 && imc < 29.9) {
        navigation.navigate("SurpoidsExercice"); // Navigate to exercises for overweight
      } else {
        navigation.navigate("ObesiteExercice"); // Navigate to exercises for obesity
      }
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

      {/* Nouveau bouton pour afficher les exercices selon l'IMC */}
      <TouchableOpacity style={styles.button} onPress={handleExerciceApiPress}>
        <Text style={styles.buttonText}>Voir les exercices recommandés</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
