import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // Importation mise à jour
import {
  fetchExercises,
  createExercise,
} from "../../../../redux/features/exercise/exerciseSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./ExerciseScreenStyle";

const ExerciseScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [exerciseName, setExerciseName] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [exerciseType, setExerciseType] = useState("Running");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const loadUserExercises = async () => {
      let currentUserId = user?._id;

      if (!currentUserId) {
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        currentUserId = parsedUser?._id;
      }

      if (currentUserId) {
        setUserId(currentUserId);
        dispatch(fetchExercises(currentUserId));
      } else {
        console.error("User ID is missing");
      }
    };

    loadUserExercises();
  }, [dispatch, user]);

  const handleSaveExercise = () => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    const exerciseData = {
      userId: userId,
      exerciseName: exerciseType,
      duration: Number(duration),
      date,
    };

    dispatch(createExercise(exerciseData));
    setExerciseName("");
    setDuration("");
    setDate(new Date());
  };

  const handleFinish = () => {
    handleSaveExercise();
    navigation.navigate("ProfileTab");
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(Platform.OS === "ios");
    setDate((prevDate) => {
      const updatedDate = new Date(prevDate);
      updatedDate.setHours(currentTime.getHours());
      updatedDate.setMinutes(currentTime.getMinutes());
      return updatedDate;
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.innerContainer}
    >
      <View>
        <Text style={styles.label}>Exercise Type:</Text>
        <Picker
          selectedValue={exerciseType}
          style={styles.picker}
          onValueChange={(itemValue) => setExerciseType(itemValue)}
        >
          <Picker.Item label="Running" value="Running" />
          <Picker.Item label="Cycling" value="Cycling" />
          <Picker.Item label="Swimming" value="Swimming" />
          <Picker.Item label="Walking" value="Walking" />
          <Picker.Item label="Weight Lifting" value="Weight Lifting" />
          <Picker.Item label="Yoga" value="Yoga" />
          <Picker.Item label="Custom" value="Custom" />
        </Picker>

        {exerciseType === "Custom" && (
          <TextInput
            style={styles.input}
            placeholder="Enter Custom Exercise Name"
            value={exerciseName}
            onChangeText={(value) => setExerciseName(value)}
          />
        )}

        <Text style={styles.label}>Duration (minutes):</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={(value) => setDuration(value)}
          keyboardType="numeric"
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateTimePickerButton}
        >
          <Text style={styles.label}>
            Date: {date.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.dateTimePickerButton}
        >
          <Text style={styles.label}>
            Time: {date.getHours()}:
            {date.getMinutes().toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveExercise}
        >
          <Text style={styles.saveButtonText}>Save Exercise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ExerciseScreen;
