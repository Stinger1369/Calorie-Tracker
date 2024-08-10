import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {resetPassword} from '../../redux/features/auth/authSlice';
import {useNavigation, useRoute} from '@react-navigation/native';

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
      <Button
        title="Réinitialiser le mot de passe"
        onPress={handleResetPassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default ResetPassword;
