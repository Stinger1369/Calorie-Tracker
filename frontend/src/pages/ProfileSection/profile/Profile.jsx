import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Modal, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserInfo } from "../../../redux/features/user/userSlice";
import { restoreToken } from "../../../redux/features/auth/authSlice";
import Icon from 'react-native-vector-icons/Ionicons'; // Import de l'icône
import styles from "./ProfileStyles";
import moment from "moment";
import ProfileHeader from "./ProfileComponents/ProfileHeader/ProfileHeader";
import InfoCards from "./ProfileComponents/InfoCards/InfoCards";
import ActionCard from "./ProfileComponents/ActionCard/ActionCard";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);
  const { user, token } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false); // État pour gérer l'affichage du modal

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

        if (userId && storedToken) {
          dispatch(fetchUserInfo(userId));
        } else {
          console.error("User ID or token is missing. Cannot fetch user info.");
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
    navigation.navigate("ProfileEdit"); // Redirection vers l'édition du profil
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

  const handleExerciceApiPress = async () => {
    const hasAcceptedPolicy = await AsyncStorage.getItem("hasAcceptedPolicy");

    if (userInfo && (userInfo.height && userInfo.weight)) {
      const imc = userInfo.bmi;

      if (hasAcceptedPolicy === 'true') {
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
        navigation.navigate("PolicyScreen", { imc });
      }
    } else {
      setShowModal(true);
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <ProfileHeader
          userInfo={userInfo}
          currentDate={currentDate}
          onEditPress={handleUpdateUser}
        />
        <InfoCards userInfo={userInfo} />
        <ActionCard userInfo={userInfo} onIMCPress={handleIMCPress} />

        <TouchableOpacity style={styles.editProfileButton} onPress={handleUpdateUser}>
          <Text style={styles.buttonText}>Modifier le profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleExerciceApiPress}>
          <Text style={styles.buttonText}>Voir les exercices recommandés</Text>
        </TouchableOpacity>

        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Pressable onPress={() => setShowModal(false)} style={styles.closeIcon}>
                <Icon name="close" size={30} color="#000" />
              </Pressable>

              <Text style={styles.modalText}>
                Your profile is not completed. Please complete your profile to calculate BMI.
              </Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setShowModal(false);
                  navigation.navigate("ProfileEdit");
                }}
              >
                <Text style={styles.modalButtonText}>Complete Profile</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default Profile;
