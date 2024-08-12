import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import {
  updateUserInfo,
  fetchUserInfo,
} from "../../../../redux/features/user/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./LifestyleInfoScreenStyle";

const LifestyleInfoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [maritalStatus, setMaritalStatus] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [occupation, setOccupation] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [dailyCalorieIntake, setDailyCalorieIntake] = useState("");

  const [initialValues, setInitialValues] = useState({});
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
      const initialData = {
        maritalStatus: userInfo.maritalStatus || "",
        numberOfChildren: userInfo.numberOfChildren?.toString() || "",
        occupation: userInfo.occupation || "",
        activityLevel: userInfo.activityLevel || "",
        dietaryPreferences: userInfo.dietaryPreferences || "",
        dailyCalorieIntake: userInfo.dailyCalorieIntake?.toString() || "",
      };
      setMaritalStatus(initialData.maritalStatus);
      setNumberOfChildren(initialData.numberOfChildren);
      setOccupation(initialData.occupation);
      setActivityLevel(initialData.activityLevel);
      setDietaryPreferences(initialData.dietaryPreferences);
      setDailyCalorieIntake(initialData.dailyCalorieIntake);
      setInitialValues(initialData);
      setIsSaved(true);
      setHasChanges(false);
    }
  }, [userInfo]);

  const handleSave = () => {
    const updatedData = {
      maritalStatus,
      numberOfChildren: Number(numberOfChildren),
      occupation,
      activityLevel,
      dietaryPreferences,
      dailyCalorieIntake: Number(dailyCalorieIntake),
    };

    if (userInfo && userInfo._id) {
      dispatch(updateUserInfo({ userId: userInfo._id, userData: updatedData }));
      setInitialValues(updatedData);
      setIsSaved(true);
      setHasChanges(false);
    }
  };

  const handleNext = () => {
    handleSave();
    navigation.navigate("HabitsPreferences");
  };

  const handleInputChange = (value, setter) => {
    setter(value);
    setIsSaved(false);
    setHasChanges(true);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.innerContainer}
    >
      <View>
        <Text style={styles.label}>Marital Status:</Text>
        <Picker
          selectedValue={maritalStatus}
          style={styles.input}
          onValueChange={(itemValue) =>
            handleInputChange(itemValue, setMaritalStatus)
          }
        >
          <Picker.Item label="Select marital status" value="" />
          <Picker.Item label="Single" value="single" />
          <Picker.Item label="Married" value="married" />
          <Picker.Item label="Divorced" value="divorced" />
          <Picker.Item label="Widowed" value="widowed" />
        </Picker>

        <Text style={styles.label}>Number of Children:</Text>
        <TextInput
          style={styles.input}
          value={numberOfChildren}
          onChangeText={(value) =>
            handleInputChange(value, setNumberOfChildren)
          }
          keyboardType="numeric"
        />

        <Text style={styles.label}>Occupation:</Text>
        <Picker
          selectedValue={occupation}
          style={styles.input}
          onValueChange={(itemValue) =>
            handleInputChange(itemValue, setOccupation)
          }
        >
          <Picker.Item label="Select occupation" value="" />
          <Picker.Item label="Office work" value="office_work" />
          <Picker.Item label="Manual labor" value="manual_labor" />
          <Picker.Item label="Unemployed" value="unemployed" />
          <Picker.Item label="Other" value="other" />
        </Picker>

        <Text style={styles.label}>Activity Level:</Text>
        <Picker
          selectedValue={activityLevel}
          style={styles.input}
          onValueChange={(itemValue) =>
            handleInputChange(itemValue, setActivityLevel)
          }
        >
          <Picker.Item label="Select activity level" value="" />
          <Picker.Item label="Sedentary" value="sedentary" />
          <Picker.Item label="Lightly active" value="lightly_active" />
          <Picker.Item label="Moderately active" value="moderately_active" />
          <Picker.Item label="Very active" value="very_active" />
        </Picker>

        <Text style={styles.label}>Dietary Preferences:</Text>
        <Picker
          selectedValue={dietaryPreferences}
          style={styles.input}
          onValueChange={(itemValue) =>
            handleInputChange(itemValue, setDietaryPreferences)
          }
        >
          <Picker.Item label="Select dietary preference" value="" />
          <Picker.Item label="Vegetarian" value="vegetarian" />
          <Picker.Item label="Vegan" value="vegan" />
          <Picker.Item label="Pescatarian" value="pescatarian" />
          <Picker.Item label="Omnivore" value="omnivore" />
          <Picker.Item label="Other" value="other" />
        </Picker>

        <Text style={styles.label}>Daily Calorie Intake:</Text>
        <TextInput
          style={styles.input}
          value={dailyCalorieIntake}
          onChangeText={(value) =>
            handleInputChange(value, setDailyCalorieIntake)
          }
          keyboardType="numeric"
        />
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

export default LifestyleInfoScreen;
