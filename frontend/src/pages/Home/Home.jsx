import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import styles from "./homeStyles";
import moment from "moment";

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLogout = async (saveData) => {
    closeModal();
    dispatch(logout({ saveData }));
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcom" }],
    });
  };

  // Get the current date formatted
  const currentDate = moment().format("dddd, MMMM Do YYYY");

  return (
    <ImageBackground
      // source={require("./path_to_your_background_image.png")} // Replace with your background image path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconContainer} onPress={openModal}>
            <Text style={styles.iconText}>X</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <Text style={styles.welcomeText}>
          Bienvenue sur la page d'accueil !
        </Text>
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.zodiacText}>Horoscope: Leo</Text>

        {/* Logout Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.iconText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.modalText}>
                Souhaitez-vous sauvegarder vos données pour une connexion rapide
                la prochaine fois?
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
      </View>
    </ImageBackground>
  );
};

export default Home;
