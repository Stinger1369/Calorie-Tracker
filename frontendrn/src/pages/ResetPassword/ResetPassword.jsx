import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {resetPassword} from '../../redux/features/auth/authSlice';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './resetPasswordStyles'; // Import external styles

const ResetPassword = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {email} = route.params;

  const handleResetPassword = async () => {
    try {
      const response = await dispatch(
        resetPassword({token: code, newPassword}),
      ).unwrap();
      console.log('Password reset response:', response);
      navigation.navigate('Login'); // Redirect to Login after successful password reset
    } catch (err) {
      console.log('Password reset failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialiser le mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Code de vérification"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;
