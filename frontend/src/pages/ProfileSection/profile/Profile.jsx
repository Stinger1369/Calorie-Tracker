import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Modal, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfoWithFields } from "../../../redux/features/user/userSlice";
import Icon from 'react-native-vector-icons/Ionicons';
import styles from "./ProfileStyles";
import moment from "moment";
import ProfileHeader from "./ProfileComponents/ProfileHeader/ProfileHeader";
import InfoCards from "./ProfileComponents/InfoCards/InfoCards";
import ActionCard from "./ProfileComponents/ActionCard/ActionCard";

const ProfileTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [localUserId, setLocalUserId] = useState(null);
  const [isTokenRestored, setIsTokenRestored] = useState(false);  // Suivre la restauration du token

  // Premier useEffect: Restauration des données utilisateur
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userId = user?._id;

        if (userId) {
          setLocalUserId(userId);
          setIsTokenRestored(true);  // Restauration terminée
        } else {
          console.error("User ID manquant. Redirection vers la page de connexion...");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
      }
    };

    loadUserData();
  }, [user, navigation]);

  // Deuxième useEffect: Récupérer les informations utilisateur après restauration
  useEffect(() => {
    if (localUserId) {
      console.log("Fetching user info for userId:", localUserId);
      dispatch(fetchUserInfoWithFields({ userId: localUserId, fields: ["firstName", "lastName", "bmi", "imageUrl", "weight", "height"], source: "ProfileTab" }))
        .unwrap()
        .then((response) => {
          console.log("User info fetched successfully:", response);
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
          if (err.message.includes("Unauthorized")) {
            navigation.navigate("Login");
          }
        });
    } else {
      console.log("User ID manquant. Impossible de récupérer les informations utilisateur.");
    }
  }, [localUserId, dispatch, navigation]);

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

  const handleExerciceApiPress = async () => {
    const hasAcceptedPolicy = userInfo?.hasAcceptedPolicy;
    const userIdToPass = userInfo?._id || localUserId;

    if (userInfo && userInfo.height && userInfo.weight) {
      const imc = userInfo.bmi;

      if (hasAcceptedPolicy) {
        if (imc < 18.5) {
          navigation.navigate("InsuffisantExercice", { userId: userIdToPass });
        } else if (imc >= 18.5 && imc < 24.9) {
          navigation.navigate("NormalExercice", { userId: userIdToPass });
        } else if (imc >= 25 && imc < 29.9) {
          navigation.navigate("SurpoidsExercice", { userId: userIdToPass });
        } else {
          navigation.navigate("ObesiteExercice", { userId: userIdToPass });
        }
      } else {
        navigation.navigate("PolicyScreen", { imc, userId: userIdToPass });
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCreateProgramPress = () => {
    navigation.navigate("CreateProgramScreen");
  };

  const currentDate = moment().format("dddd, DD MMMM");

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error && !error.includes("Unauthorized")) {
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
        <ProfileHeader userInfo={userInfo} currentDate={currentDate} onEditPress={handleUpdateUser} />
        <InfoCards userInfo={userInfo} />
        <ActionCard userInfo={userInfo} onIMCPress={handleIMCPress} />
        {/* Ajout d'autres sections du profil */}

        <TouchableOpacity style={styles.button} onPress={handleCreateProgramPress}>
          <Text style={styles.buttonText}>Créer Votre Propre Programme</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleExerciceApiPress}>
          <Text style={styles.buttonText}>Voir les exercices recommandés</Text>
        </TouchableOpacity>

        <Modal visible={showModal} transparent={true} animationType="slide" onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Pressable onPress={() => setShowModal(false)} style={styles.closeIcon}>
                <Icon name="close" size={30} color="#000" />
              </Pressable>
              <Text style={styles.modalText}>
                Your profile is not completed. Please complete your profile to calculate BMI.
              </Text>
              <Pressable style={styles.modalButton} onPress={() => {
                setShowModal(false);
                navigation.navigate("ProfileEdit");
              }}>
                <Text style={styles.modalButtonText}>Complete Profile</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default ProfileTab;
