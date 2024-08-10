import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {verifyCode, requestNewCode} from '../../redux/features/auth/authSlice';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleVerify = async () => {
    try {
      await dispatch(verifyCode({email, code})).unwrap();
      navigation.navigate('Login'); // Redirection vers l'écran de connexion après vérification réussie
    } catch (err) {
      Alert.alert(
        'Erreur',
        err || "Une erreur s'est produite lors de la vérification.",
      );
    }
  };

  const handleRequestNewCode = async () => {
    try {
      const response = await dispatch(requestNewCode(email)).unwrap();
      Alert.alert('Nouveau code envoyé', response.message);
    } catch (err) {
      Alert.alert(
        'Erreur',
        err || "Une erreur s'est produite lors de l'envoi du nouveau code.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification de l'email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Code de vérification"
        value={code}
        onChangeText={setCode}
      />
      <Button title="Vérifier" onPress={handleVerify} />
      <Button title="Renvoyer le code" onPress={handleRequestNewCode} />
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

export default VerifyEmail;
