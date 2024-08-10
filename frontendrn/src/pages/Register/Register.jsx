import React from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../redux/features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Password too short').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Required'),
  });
const handleRegister = async values => {
  try {
    // Effacer les anciennes données de l'utilisateur avant d'enregistrer les nouvelles
    await AsyncStorage.removeItem('user');
    console.log('User data in AsyncStorage cleared');

    // Envoyer les nouvelles données pour l'inscription
    const response = await dispatch(registerUser(values)).unwrap();
    console.log('Response from server after registration:', response);

    // Aucune sauvegarde dans l'AsyncStorage ici, car l'utilisateur n'est pas encore connecté
    navigation.navigate('VerifyEmail');
  } catch (err) {
    console.log('Error during registration:', err);
  }
};


  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleRegister}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={styles.container}>
          <Text style={styles.title}>Inscription</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            value={values.firstName}
          />
          {touched.firstName && errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            value={values.lastName}
          />
          {touched.lastName && errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            value={values.confirmPassword}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
          <Button title="S'inscrire" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
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
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
});

export default Register;
