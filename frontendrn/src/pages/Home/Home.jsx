import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../../redux/features/auth/authSlice';
import styles from './homeStyles';

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

  const handleLogout = async saveData => {
    closeModal(); // Fermer le modal
    dispatch(logout({saveData}));
    navigation.reset({
      index: 0,
      routes: [{name: 'Welcom'}], // Rediriger vers l'écran Welcom et réinitialiser la navigation
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer} onPress={openModal}>
          <Text style={styles.iconText}>X</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.welcomeText}>Bienvenue sur la page d'accueil !</Text>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
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
                onPress={() => handleLogout(true)}>
                <Text style={styles.modalButtonText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleLogout(false)}>
                <Text style={styles.modalButtonText}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
