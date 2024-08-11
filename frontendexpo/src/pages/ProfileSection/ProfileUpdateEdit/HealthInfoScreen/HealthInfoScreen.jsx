import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserInfo,
  fetchUserInfo,
} from "../../../../redux/features/user/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./HealthInfoScreenStyle";

const HealthInfoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [bloodTestResults, setBloodTestResults] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      let userId = user?._id;

      if (!userId) {
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        userId = parsedUser?._id;
      }

      if (userId) {
        dispatch(fetchUserInfo(userId));
      }
    };

    loadUserData();
  }, [dispatch, user]);

  useEffect(() => {
    if (userInfo) {
      setWeight(userInfo.weight?.toString() || "");
      setHeight(userInfo.height?.toString() || "");
      setMedicalConditions(userInfo.medicalConditions || []);
      setBloodTestResults(userInfo.bloodTestResults || []);
      setIsSaved(true);
      setHasChanges(false);
    }
  }, [userInfo]);

  const handleSave = () => {
    const updatedData = {
      weight: parseFloat(weight),
      height: parseFloat(height),
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

  const handleInputChange = (value, setter) => {
    setter(value);
    setIsSaved(false);
    setHasChanges(true);
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
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={(value) => handleInputChange(value, setWeight)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Height (cm):</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={(value) => handleInputChange(value, setHeight)}
          keyboardType="numeric"
        />

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
