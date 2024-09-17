import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, ImageBackground, Modal, Text, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, fetchUserId } from "../../redux/features/user/userSlice"; // Fetch user info from Redux
import { restoreToken,logout,  } from "../../redux/features/auth/authSlice"; // Restore token from AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./homeStyles";
import moment from "moment";
import Header from "./HomeSection/Header";
import Section from "./HomeSection/Section";
import LogoutModal from "../../components/Logout/LogoutModal";
const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [incompleteProfileSection, setIncompleteProfileSection] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);

  // Récupérer l'ID utilisateur depuis AsyncStorage et restaurer le token s'il n'est pas présent
  useEffect(() => {
    const restoreUserData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        dispatch(restoreToken({ token: storedToken, user: JSON.parse(storedUser) }));
      } else {
        console.error("Token or user not found in AsyncStorage");
      }
    };

    restoreUserData();
  }, [dispatch]);

  // Récupérer les informations de l'utilisateur lorsque l'écran est focus
useFocusEffect(
  useCallback(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId && token) {
        console.log("Fetching user info with userId:", userId);
        await dispatch(fetchUserInfo({ userId, source: "home" }));
      } else {
        console.error("User ID or token not found");
      }
    };

    // Assurez-vous que le token est bien initialisé avant de faire l'appel API
    if (token && !userInfo) {
      fetchUserData();
    }
  }, [dispatch, token, userInfo])
);


  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleLogout = async (saveData) => {
    closeModal();
    dispatch(logout({ saveData }));
    navigation.reset({ index: 0, routes: [{ name: "Welcom" }] });
  };

  const handleProfileModal = (section) => {
    setIncompleteProfileSection(section);
    setProfileModalVisible(true);
  };

  const closeProfileModal = () => setProfileModalVisible(false);

  const navigateToProfileEdit = () => {
    closeProfileModal();
    navigation.navigate("ProfileEdit");
  };

  const isProfileComplete = () => {
    return userInfo?.dateOfBirth && userInfo?.height && userInfo?.weight && userInfo?.bmi;
  };

  const handleHoroscopePress = () => {
    if (isProfileComplete()) {
      navigation.navigate("HoroscopeDetailsScreen", {
        zodiacSign: userInfo.zodiacSign,
        dateOfBirth: userInfo.dateOfBirth,
      });
    } else {
      handleProfileModal("Horoscope");
    }
  };

  const currentDate = moment().format("dddd, MMMM Do YYYY");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground style={styles.backgroundImage}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: "10%", flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Header userInfo={userInfo} currentDate={currentDate} openModal={openModal} />

          <View style={styles.sectionsContainer}>
            <Section
              iconType="MaterialCommunityIcons"
              iconName="chat"
              label="Chat"
              onPress={() => {
                if (isProfileComplete()) {
                  console.log("Navigating to Chat");
                } else {
                  handleProfileModal("Chat");
                }
              }}
              style={styles.sectionChat}
            />

            <Section
              iconType="MaterialCommunityIcons"
              iconName="heart"
              label="Rencontres"
              onPress={() => {
                if (isProfileComplete()) {
                  console.log("Navigating to Rencontres");
                } else {
                  handleProfileModal("Rencontres");
                }
              }}
              style={styles.sectionDating}
            />

            <Section
              iconType="MaterialCommunityIcons"
              iconName="food"
              label="Nutrition"
              onPress={() => navigation.navigate("ScanTabs")}
              style={styles.sectionNutrition}
            />

            <Section
              iconType="MaterialCommunityIcons"
              iconName="dumbbell"
              label="Exercice"
              onPress={() => navigation.navigate("FitnessExercices")}
              style={styles.sectionExercise}
            />

            <Section
              iconType="MaterialCommunityIcons"
              iconName="star"
              label="Horoscope"
              onPress={handleHoroscopePress}
              style={styles.sectionHoroscope}
            />

            <Section
              iconType="MaterialCommunityIcons"
              iconName="account-group"
              label="Activités de groupe"
              onPress={() => {}}
              style={styles.sectionGroupActivities}
            />

            <Section
              iconType="MaterialCommunityIcons"
              iconName="fire"
              label="Calories Needed"
              onPress={() => {
                if (isProfileComplete()) {
                  console.log("Navigating to Calories Needed");
                } else {
                  handleProfileModal("Calories Needed");
                }
              }}
              style={styles.sectionCaloriesNeeded}
            />

            <Section
              iconType="MaterialCommunityIcons"
              iconName="calculator"
              label="Calculateur de Calories"
              onPress={() => {}}
              style={styles.sectionCalorieCalculator}
            />

            <Section
              iconType="MaterialCommunityIcons"
              iconName="account-multiple"
              label="Membres"
              onPress={() => {
                if (isProfileComplete()) {
                  console.log("Navigating to Membres");
                } else {
                  handleProfileModal("Membres");
                }
              }}
              style={styles.sectionMembers}
            />

            <Section
              iconType="MaterialCommunityIcons"
              iconName="food-apple"
              label="Recettes"
              onPress={() => navigation.navigate("RecetteScreen")}
              style={styles.sectionRecipes}
            />
          </View>

          <LogoutModal
  modalVisible={modalVisible}
  closeModal={closeModal}
  handleLogout={handleLogout}
/>
          <Modal
            animationType="slide"
            transparent={true}
            visible={profileModalVisible}
            onRequestClose={closeProfileModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Vous devez compléter votre profil pour accéder à la section {incompleteProfileSection}.
                </Text>
                <TouchableOpacity style={styles.modalButton} onPress={navigateToProfileEdit}>
                  <Text style={styles.modalButtonText}>Compléter le profil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={closeProfileModal}>
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;
