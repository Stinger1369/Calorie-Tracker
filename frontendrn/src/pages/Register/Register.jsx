import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../redux/features/auth/authSlice';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import styles from './registerStyles'; // Import external styles

const Register = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Prénom requis'),
    lastName: Yup.string().required('Nom requis'),
    email: Yup.string().email('Email invalide').required('Email requis'),
    password: Yup.string()
      .min(6, 'Mot de passe trop court')
      .required('Mot de passe requis'),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('password'), undefined],
        'Les mots de passe doivent correspondre',
      )
      .required('Confirmation de mot de passe requise'),
  });

  const handleRegister = async values => {
    try {
      // Envoyer les nouvelles données pour l'inscription
      const response = await dispatch(registerUser(values)).unwrap();
      console.log('Response from server after registration:', response);

      // Naviguer vers l'écran de vérification de l'email
      navigation.navigate('VerifyEmail');
    } catch (err) {
      console.log("Erreur lors de l'inscription :", err);
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
            placeholder="Prénom"
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            value={values.firstName}
          />
          {touched.firstName && errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Nom"
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
            placeholder="Mot de passe"
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
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            value={values.confirmPassword}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default Register;
