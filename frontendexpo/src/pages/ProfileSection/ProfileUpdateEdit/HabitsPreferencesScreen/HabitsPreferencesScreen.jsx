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
import styles from "./HabitsPreferencesScreenStyle";

const HabitsPreferencesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [smokingHabits, setSmokingHabits] = useState("");
  const [alcoholConsumption, setAlcoholConsumption] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [sleepDuration, setSleepDuration] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [dailyStepCount, setDailyStepCount] = useState("");
  const [dailyActiveMinutes, setDailyActiveMinutes] = useState("");
  const [foodAllergies, setFoodAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [supplements, setSupplements] = useState("");

  const [initialValues, setInitialValues] = useState({});
  const [isSaved, setIsSaved] = useState(false);

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
      const initialData = {
        smokingHabits: userInfo.smokingHabits || "",
        alcoholConsumption: userInfo.alcoholConsumption || "",
        stressLevel: userInfo.stressLevel || "",
        sleepDuration: userInfo.sleepDuration?.toString() || "",
        waterIntake: userInfo.waterIntake?.toString() || "",
        dailyStepCount: userInfo.dailyStepCount?.toString() || "",
        dailyActiveMinutes: userInfo.dailyActiveMinutes?.toString() || "",
        foodAllergies: userInfo.foodAllergies?.join(", ") || "",
        medications: userInfo.medications?.join(", ") || "",
        supplements: userInfo.supplements?.join(", ") || "",
      };
      setSmokingHabits(initialData.smokingHabits);
      setAlcoholConsumption(initialData.alcoholConsumption);
      setStressLevel(initialData.stressLevel);
      setSleepDuration(initialData.sleepDuration);
      setWaterIntake(initialData.waterIntake);
      setDailyStepCount(initialData.dailyStepCount);
      setDailyActiveMinutes(initialData.dailyActiveMinutes);
      setFoodAllergies(initialData.foodAllergies);
      setMedications(initialData.medications);
      setSupplements(initialData.supplements);
      setInitialValues(initialData);
      setIsSaved(true);
    }
  }, [userInfo]);

  const hasChanges = () => {
    return (
      smokingHabits !== initialValues.smokingHabits ||
      alcoholConsumption !== initialValues.alcoholConsumption ||
      stressLevel !== initialValues.stressLevel ||
      sleepDuration !== initialValues.sleepDuration ||
      waterIntake !== initialValues.waterIntake ||
      dailyStepCount !== initialValues.dailyStepCount ||
      dailyActiveMinutes !== initialValues.dailyActiveMinutes ||
      foodAllergies !== initialValues.foodAllergies ||
      medications !== initialValues.medications ||
      supplements !== initialValues.supplements
    );
  };

  const handleSave = () => {
    const updatedData = {
      smokingHabits,
      alcoholConsumption,
      stressLevel,
      sleepDuration: Number(sleepDuration),
      waterIntake: Number(waterIntake),
      dailyStepCount: Number(dailyStepCount),
      dailyActiveMinutes: Number(dailyActiveMinutes),
      foodAllergies: foodAllergies.split(",").map((item) => item.trim()),
      medications: medications.split(",").map((item) => item.trim()),
      supplements: supplements.split(",").map((item) => item.trim()),
    };

    if (userInfo && userInfo._id) {
      dispatch(updateUserInfo({ userId: userInfo._id, userData: updatedData }));
      setInitialValues(updatedData);
      setIsSaved(true);
    }
  };

  const handleNext = () => {
    navigation.navigate("AdditionalInfo");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Smoking Habits:</Text>
        <TextInput
          style={styles.input}
          value={smokingHabits}
          onChangeText={(value) => setSmokingHabits(value)}
        />
        <Text style={styles.label}>Alcohol Consumption:</Text>
        <TextInput
          style={styles.input}
          value={alcoholConsumption}
          onChangeText={(value) => setAlcoholConsumption(value)}
        />
        <Text style={styles.label}>Stress Level:</Text>
        <TextInput
          style={styles.input}
          value={stressLevel}
          onChangeText={(value) => setStressLevel(value)}
        />
        <Text style={styles.label}>Sleep Duration (hours):</Text>
        <TextInput
          style={styles.input}
          value={sleepDuration}
          onChangeText={(value) => setSleepDuration(value)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Water Intake (liters):</Text>
        <TextInput
          style={styles.input}
          value={waterIntake}
          onChangeText={(value) => setWaterIntake(value)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Daily Step Count:</Text>
        <TextInput
          style={styles.input}
          value={dailyStepCount}
          onChangeText={(value) => setDailyStepCount(value)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Daily Active Minutes:</Text>
        <TextInput
          style={styles.input}
          value={dailyActiveMinutes}
          onChangeText={(value) => setDailyActiveMinutes(value)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Food Allergies (comma separated):</Text>
        <TextInput
          style={styles.input}
          value={foodAllergies}
          onChangeText={(value) => setFoodAllergies(value)}
        />
        <Text style={styles.label}>Medications (comma separated):</Text>
        <TextInput
          style={styles.input}
          value={medications}
          onChangeText={(value) => setMedications(value)}
        />
        <Text style={styles.label}>Supplements (comma separated):</Text>
        <TextInput
          style={styles.input}
          value={supplements}
          onChangeText={(value) => setSupplements(value)}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={!hasChanges()}
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
      </View>
    </ScrollView>
  );
};

export default HabitsPreferencesScreen;
