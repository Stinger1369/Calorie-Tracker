// components/LogoutModal.jsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../pages/Home/homeStyles';

const LogoutModal = ({ modalVisible, closeModal, handleLogout }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <MaterialCommunityIcons name="close" size={30} color="#e74c3c" />
          </TouchableOpacity>

          <Text style={styles.modalText}>
            Souhaitez-vous sauvegarder vos données pour une connexion rapide la prochaine fois?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleLogout(true)}>
              <Text style={styles.modalButtonText}>Oui</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleLogout(false)}>
              <Text style={styles.modalButtonText}>Non</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
