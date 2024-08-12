import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { loginUser, requestNewCode } from "../../redux/features/auth/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./loginStyles"; // Import external styles

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("Email est requis"),
    password: Yup.string().required("Mot de passe est requis"),
  });

  const handleLogin = async (values) => {
    try {
      console.log("Attempting to log in with values:", values); // Log the input values

      const response = await dispatch(loginUser(values)).unwrap();

      // Vérifiez que l'utilisateur est correctement stocké
      console.log("User logged in successfully:", response.user);

      // Sauvegarder l'ID de l'utilisateur dans AsyncStorage
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ ...response.user, _id: response.user._id })
      );

      console.log("User saved to AsyncStorage"); // Log when user is saved
      navigation.navigate("Home");
    } catch (err) {
      console.log("Login failed:", err); // Log any errors that occur during login
    }
  };

  const handleForgotPassword = async (email, setFieldTouched) => {
    if (!email) {
      setFieldTouched("email", true);
      console.log("Email field touched but no email provided"); // Log when email is missing
      return;
    }

    try {
      console.log("Requesting new verification code for:", email); // Log the email for which the code is requested
      await dispatch(requestNewCode(email)).unwrap();
      console.log("Verification code sent successfully"); // Log when code is sent
      navigation.navigate("ResetPassword", { email });
    } catch (err) {
      console.log("Failed to send verification code:", err); // Log any errors in sending the code
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
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
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => handleForgotPassword(values.email, setFieldTouched)}
          >
            <Text style={styles.forgotButtonText}>Mot de passe oublié?</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default Login;
