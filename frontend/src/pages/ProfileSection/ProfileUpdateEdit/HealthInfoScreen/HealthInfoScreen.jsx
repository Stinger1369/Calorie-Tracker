import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker"; // Importer le Picker
import {
  updateUserInfo,
  fetchUserInfo,
} from "../../../../redux/features/user/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./HealthInfoScreenStyle";

const HealthInfoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { user,token  } = useSelector((state) => state.auth);

  const [weight, setWeight] = useState(null); // Valeur par défaut du poids
  const [height, setHeight] = useState(null); // Valeur par défaut de la taille
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [bloodTestResults, setBloodTestResults] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let userId = user?._id;
        let storedToken = token;
  
        console.log("User ID:", userId);
        console.log("Stored Token:", storedToken);
  
        if (!userId || !storedToken) {
          const storedUser = await AsyncStorage.getItem("user");
          storedToken = await AsyncStorage.getItem("token");
  
          console.log("Stored User:", storedUser);
          console.log("Stored Token:", storedToken);
  
          if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser?._id;
  
            dispatch(restoreToken({ user: parsedUser, token: storedToken }));
          }
        }

        if (userId && storedToken) {
          await dispatch(fetchUserInfo(userId));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
  
    loadUserData();
  }, [dispatch, user, token]);
  

  useEffect(() => {
    if (userInfo) {
      setWeight(userInfo.weight || null); // Ajuste la valeur initiale si présente
      setHeight(userInfo.height || null); // Ajuste la valeur initiale si présente
      setMedicalConditions(userInfo.medicalConditions || []);
      setBloodTestResults(userInfo.bloodTestResults || []);
      setIsSaved(true);
      setHasChanges(false);
    }
  }, [userInfo]);

const handleSave = () => {
  if (weight < 2 || weight > 350) {
    alert("Veuillez entrer un poids valide (entre 2 et 350 kg).");
    return;
  }
  if (height < 50 || height > 250) {
    alert("Veuillez entrer une taille valide (entre 50 et 250 cm).");
    return;
  }

  const updatedData = {
    weight: weight !== null ? parseFloat(weight) : null,
    height: height !== null ? parseFloat(height) : null,
    medicalConditions,
    bloodTestResults,
  };

  if (userInfo && userInfo._id) {
    dispatch(updateUserInfo({ userId: userInfo._id, userData: updatedData }));
    setIsSaved(true);
    setHasChanges(false);
  }
};



  const handleNext = () => {
    handleSave();
    navigation.navigate("LifestyleInfo");
  };

  const handleAddMedicalCondition = () => {
    setMedicalConditions([...medicalConditions, ""]);
  };

  const handleMedicalConditionChange = (text, index) => {
    const updatedConditions = medicalConditions.map((condition, i) =>
      i === index ? text : condition
    );
    setMedicalConditions(updatedConditions);
  };

  const handleAddBloodTestResult = () => {
    setBloodTestResults([
      ...bloodTestResults,
      {
        cholesterol: "",
        bloodSugar: "",
        hemoglobin: "",
        date: "",
      },
    ]);
  };

  const handleBloodTestResultChange = (field, value, index) => {
    const updatedResults = bloodTestResults.map((result, i) =>
      i === index ? { ...result, [field]: value } : result
    );
    setBloodTestResults(updatedResults);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.innerContainer}
    >
      <View>
        <Text style={styles.label}>Weight (kg):</Text>
        <Picker
          selectedValue={weight}
          onValueChange={(itemValue) => {
            if (itemValue === null) {
              setWeight(null);
            } else {
              setWeight(itemValue);
            }
            setHasChanges(true);
            setIsSaved(false);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Not specified" value={null} />
          {Array.from({ length: 349 }, (_, i) => i + 2).map((value) => (
            <Picker.Item key={value} label={`${value} kg`} value={value} />
          ))}
        </Picker>

        <Text style={styles.label}>Height (cm):</Text>
        <Picker
          selectedValue={height}
          onValueChange={(itemValue) => {
            if (itemValue === null) {
              setHeight(null);
            } else {
              setHeight(itemValue);
            }
            setHasChanges(true);
            setIsSaved(false);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Not specified" value={null} />
          {Array.from({ length: 201 }, (_, i) => i + 50).map((value) => (
            <Picker.Item key={value} label={`${value} cm`} value={value} />
          ))}
        </Picker>

        <Text style={styles.label}>Medical Conditions:</Text>
        {medicalConditions.map((condition, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={condition}
            onChangeText={(text) => handleMedicalConditionChange(text, index)}
            placeholder={`Condition ${index + 1}`}
          />
        ))}
        <TouchableOpacity
          onPress={handleAddMedicalCondition}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add Medical Condition</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Blood Test Results:</Text>
        {bloodTestResults.map((result, index) => (
          <View key={index} style={styles.bloodTestContainer}>
            <TextInput
              style={styles.input}
              value={result.cholesterol}
              onChangeText={(text) =>
                handleBloodTestResultChange("cholesterol", text, index)
              }
              placeholder="Cholesterol"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={result.bloodSugar}
              onChangeText={(text) =>
                handleBloodTestResultChange("bloodSugar", text, index)
              }
              placeholder="Blood Sugar"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={result.hemoglobin}
              onChangeText={(text) =>
                handleBloodTestResultChange("hemoglobin", text, index)
              }
              placeholder="Hemoglobin"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={result.date}
              onChangeText={(text) =>
                handleBloodTestResultChange("date", text, index)
              }
              placeholder="Test Date (YYYY-MM-DD)"
            />
          </View>
        ))}
        <TouchableOpacity
          onPress={handleAddBloodTestResult}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add Blood Test Result</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={!hasChanges}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={!isSaved}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HealthInfoScreen;
