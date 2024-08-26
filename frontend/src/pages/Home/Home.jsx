import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { fetchUserInfo } from "../../redux/features/user/userSlice";
import styles from "./homeStyles";
import moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const userId = userInfo?._id;
    if (userId) {
      dispatch(fetchUserInfo(userId));
    }
  }, [dispatch]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleLogout = async (saveData) => {
    closeModal();
    dispatch(logout({ saveData }));
    navigation.reset({ index: 0, routes: [{ name: "Welcom" }] });
  };

  const handleHoroscopePress = () => {
    if (userInfo?.dateOfBirth && userInfo?.zodiacSign) {
      navigation.navigate("HoroscopeDetailsScreen", {
        zodiacSign: userInfo.zodiacSign,
        dateOfBirth: userInfo.dateOfBirth,
      });
    }
  };

  const handleRecipesPress = () => navigation.navigate("RecetteScreen");

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
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileInfoContainer}>
              {renderProfileIcon()}
              <View style={styles.greetingContainer}>
                <Text style={styles.welcomeText}>
                  Hello {userInfo?.firstName}!
                </Text>
                <Text style={styles.dateText}>{currentDate}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.iconContainer} onPress={openModal}>
              <MaterialCommunityIcons name="logout" size={30} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Main Sections */}
          <View style={styles.sectionsContainer}>
            <TouchableOpacity
              style={[styles.section, styles.sectionChat]}
              onPress={() => {}}
            >
              <MaterialCommunityIcons name="chat" size={40} color="#ffffff" />
              <Text style={styles.sectionText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, styles.sectionDating]}
              onPress={() => {}}
            >
              <FontAwesome name="heart" size={40} color="#ffffff" />
              <Text style={styles.sectionText}>Rencontres</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, styles.sectionNutrition]}
              onPress={() => {}}
            >
              <MaterialCommunityIcons name="food" size={40} color="#ffffff" />
              <Text style={styles.sectionText}>Nutrition</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, styles.sectionExercise]}
              onPress={() => {}}
            >
              <FontAwesome5 name="dumbbell" size={40} color="#ffffff" />
              <Text style={styles.sectionText}>Exercice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, styles.sectionHoroscope]}
              onPress={handleHoroscopePress}
            >
              <FontAwesome5 name="star" size={40} color="#ffffff" />
              <Text style={styles.sectionText}>Horoscope</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, styles.sectionGroupActivities]}
              onPress={() => {}}
            >
              <MaterialCommunityIcons
                name="account-group"
                size={40}
                color="#ffffff"
              />
              <Text style={styles.sectionText}>Activités de groupe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, styles.sectionCaloriesNeeded]}
              onPress={() => {}}
            >
              <FontAwesome5 name="burn" size={40} color="#ffffff" />
              <Text style={styles.sectionText}>Calories Needed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, styles.sectionCalorieCalculator]}
              onPress={() => {}}
            >
              <MaterialCommunityIcons
                name="calculator"
                size={40}
                color="#ffffff"
              />
              <Text style={styles.sectionText}>Calculateur de Calories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, styles.sectionMembers]}
              onPress={() => {}}
            >
              <FontAwesome5 name="users" size={40} color="#ffffff" />
              <Text style={styles.sectionText}>Membres</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.section, styles.sectionRecipes]}
              onPress={handleRecipesPress}
            >
              <MaterialCommunityIcons
                name="food-apple"
                size={40}
                color="#ffffff"
              />
              <Text style={styles.sectionText}>Recettes</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Bouton de fermeture en haut à droite */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={30}
                    color="#e74c3c"
                  />
                </TouchableOpacity>

                <Text style={styles.modalText}>
                  Souhaitez-vous sauvegarder vos données pour une connexion
                  rapide la prochaine fois?
                </Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => handleLogout(true)}
                  >
                    <Text style={styles.modalButtonText}>Oui</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => handleLogout(false)}
                  >
                    <Text style={styles.modalButtonText}>Non</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;
