import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, Button} from 'react-native';
import styles from './homeStyles'; // Externalized styles

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLogout = () => {
    // Close the modal and handle logout logic
    setModalVisible(false);
    // Redirect to Logout logic or perform other actions
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
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.iconText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>
              Voulez-vous vraiment vous déconnecter?
            </Text>
            <View style={styles.buttonRow}>
              <Button title="Yes" onPress={handleLogout} />
              <Button title="No" onPress={closeModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
