import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  verifyCode,
  requestNewCode,
} from '../../../redux/features/auth/authSlice';
import {Formik} from 'formik';
import * as Yup from 'yup';
import styles from './verifyEmailStyles'; // Import external styles

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email invalide').required('Email requis'),
    code: Yup.string().required('Code de vérification requis'),
  });

  const handleVerify = async (values, {setSubmitting, setErrors}) => {
    try {
      await dispatch(verifyCode(values)).unwrap();
      navigation.navigate('Login'); // Redirection vers l'écran de connexion après vérification réussie
    } catch (err) {
      setErrors({general: err || 'Erreur lors de la vérification du code.'});
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestNewCode = async (email, setErrors) => {
    if (!email) {
      setErrors({email: 'Veuillez entrer votre adresse email'});
      return;
    }
    try {
      const response = await dispatch(requestNewCode(email)).unwrap();
      setErrors({general: response.message});
    } catch (err) {
      setErrors({general: err || "Erreur lors de l'envoi du nouveau code."});
    }
  };

  return (
    <Formik
      initialValues={{email: '', code: ''}}
      validationSchema={validationSchema}
      onSubmit={handleVerify}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setErrors,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Vérification de l'email</Text>
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
            placeholder="Code de vérification"
            value={values.code}
            onChangeText={handleChange('code')}
            onBlur={handleBlur('code')}
          />
          {touched.code && errors.code && (
            <Text style={styles.errorText}>{errors.code}</Text>
          )}
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            <Text style={styles.buttonText}>Vérifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.resendButton]}
            onPress={() => handleRequestNewCode(values.email, setErrors)}
            disabled={isSubmitting}>
            <Text style={styles.buttonText}>Renvoyer le code</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default VerifyEmail;
