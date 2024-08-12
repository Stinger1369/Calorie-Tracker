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
import { Picker } from "@react-native-picker/picker";
import {
  fetchExercises,
  createExercise,
  updateExercise,
} from "../../../../redux/features/exercise/exerciseSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./ExerciseScreenStyle";

const ExerciseScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { exercises, loading, error } = useSelector((state) => state.exercise);

  const [exerciseId, setExerciseId] = useState(null);
  const [exerciseName, setExerciseName] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [exerciseType, setExerciseType] = useState("Running");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const [initialState, setInitialState] = useState({
    exerciseName: "",
    duration: "",
    date: new Date(),
    exerciseType: "Running",
  });

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
        console.log(`Fetching exercises for user ID: ${currentUserId}`);
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

    const formattedDate = new Date(date);

    const exerciseData = {
      userId: userId,
      exerciseName: exerciseType === "Custom" ? exerciseName : exerciseType,
      duration: Number(duration),
      date: formattedDate,
    };

    if (exerciseId) {
      console.log(`Updating exercise with ID: ${exerciseId}`);
      dispatch(updateExercise({ exerciseId, updateData: exerciseData }))
        .unwrap()
        .then((result) => {
          console.log("Exercise updated successfully:", result);
        })
        .catch((err) => {
          console.error("Failed to update exercise:", err);
        });
    } else {
      console.log("Creating a new exercise");
      dispatch(createExercise(exerciseData))
        .unwrap()
        .then((result) => {
          console.log("Exercise created successfully:", result);
        })
        .catch((err) => {
          console.error("Failed to create exercise:", err);
        });
    }

    resetForm();
  };

  const handleEditExercise = (exercise) => {
    console.log("Editing exercise:", exercise);
    setExerciseId(exercise._id);
    setExerciseName(exercise.exerciseName);
    setDuration(exercise.duration.toString());
    setDate(new Date(exercise.date));
    setExerciseType(
      [
        "Running",
        "Cycling",
        "Swimming",
        "Walking",
        "Weight Lifting",
        "Yoga",
      ].includes(exercise.exerciseName)
        ? exercise.exerciseName
        : "Custom"
    );

    setInitialState({
      exerciseName: exercise.exerciseName,
      duration: exercise.duration.toString(),
      date: new Date(exercise.date),
      exerciseType: [
        "Running",
        "Cycling",
        "Swimming",
        "Walking",
        "Weight Lifting",
        "Yoga",
      ].includes(exercise.exerciseName)
        ? exercise.exerciseName
        : "Custom",
    });
  };

  const resetForm = () => {
    setExerciseId(null);
    setExerciseName("");
    setDuration("");
    setDate(new Date());
    setExerciseType("Running");
    setInitialState({
      exerciseName: "",
      duration: "",
      date: new Date(),
      exerciseType: "Running",
    });
    setIsFormChanged(false);
    console.log("Form reset");
  };

  const handleFinish = () => {
    handleSaveExercise();
    navigation.navigate("ProfileTab");
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
    setIsFormChanged(true);
    console.log("Date selected:", currentDate);
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
    setIsFormChanged(true);
    console.log("Time selected:", currentTime);
  };

  useEffect(() => {
    if (loading) {
      console.log("Loading...");
    } else if (error) {
      console.error("Error:", error);
    }
  }, [loading, error]);

  const isFormValid = () => {
    return (
      exerciseName !== "" &&
      duration !== "" &&
      exerciseType !== "" &&
      isFormChanged
    );
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
          onValueChange={(itemValue) => {
            setExerciseType(itemValue);
            setIsFormChanged(true);
          }}
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
            onChangeText={(value) => {
              setExerciseName(value);
              setIsFormChanged(true);
            }}
          />
        )}

        <Text style={styles.label}>Duration (minutes):</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={(value) => {
            setDuration(value);
            setIsFormChanged(true);
          }}
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

      {exercises.length > 0 && (
        <View>
          <Text style={styles.label}>Your Exercises:</Text>
          {exercises.map((exercise) => (
            <TouchableOpacity
              key={exercise._id}
              style={styles.exerciseItem}
              onPress={() => handleEditExercise(exercise)}
            >
              <Text style={styles.exerciseText}>
                {exercise.exerciseName} - {exercise.duration} min on{" "}
                {new Date(exercise.date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { opacity: isFormValid() ? 1 : 0.5 }, // Désactive visuellement le bouton
          ]}
          onPress={handleSaveExercise}
          disabled={!isFormValid()} // Désactive le bouton
        >
          <Text style={styles.saveButtonText}>
            {exerciseId ? "Update Exercise" : "Save Exercise"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ExerciseScreen;
