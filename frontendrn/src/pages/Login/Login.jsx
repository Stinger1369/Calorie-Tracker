import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {loginUser, requestNewCode} from '../../redux/features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import styles from './loginStyles'; // Import external styles

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
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      navigation.navigate('Home');
    } catch (err) {
      console.log('Login failed:', err);
    }
  };

  const handleForgotPassword = async (email, setFieldTouched) => {
    if (!email) {
      setFieldTouched('email', true);
      return;
    }

    try {
      await dispatch(requestNewCode(email)).unwrap();
      navigation.navigate('ResetPassword', {email});
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
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => handleForgotPassword(values.email, setFieldTouched)}>
            <Text style={styles.forgotButtonText}>Mot de passe oublié?</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default Login;
