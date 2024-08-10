import React from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {loginUser, requestNewCode} from '../../redux/features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email invalide').required('Email est requis'),
    password: Yup.string().required('Mot de passe est requis'),
  });

  const handleLogin = async values => {
    try {
      const response = await dispatch(loginUser(values)).unwrap();
      console.log('Login response:', response);

      // Store user information in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      console.log('User data stored in AsyncStorage:', response.user);

      navigation.navigate('Home'); // Redirect to Home after successful login
    } catch (err) {
      console.log('Login failed:', err);
    }
  };

  const handleForgotPassword = async (email, setFieldTouched) => {
    if (!email) {
      setFieldTouched('email', true); // Mark the email field as touched to trigger validation
      return;
    }

    try {
      await dispatch(requestNewCode(email)).unwrap();
      console.log('Verification code sent to email:', email);
      navigation.navigate('ResetPassword', {email}); // Navigate to reset password screen
    } catch (err) {
      console.log('Failed to send verification code:', err);
    }
  };

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validationSchema={validationSchema}
      onSubmit={handleLogin}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldTouched,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Connexion</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <Button title="Se connecter" onPress={handleSubmit} />
          <Button
            title="Mot de passe oublié?"
            onPress={() => handleForgotPassword(values.email, setFieldTouched)}
          />
          {touched.email && !values.email && (
            <Text style={styles.errorText}>
              Veuillez entrer votre adresse email
            </Text>
          )}
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

export default Login;
