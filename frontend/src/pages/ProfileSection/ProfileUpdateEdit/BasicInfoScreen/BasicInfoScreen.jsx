import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserInfo,
  fetchUserInfo,
} from "../../../../redux/features/user/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./BasicInfoScreenStyle";

const BasicInfoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setDateOfBirth(
        userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth) : new Date()
      );
      setGender(userInfo.gender || "");
      setImageUrl(userInfo.imageUrl || "");
      setIsSaved(true);
      setHasChanges(false);
    }
  }, [userInfo]);

  const handleSave = () => {
    const updatedData = {
      firstName,
      lastName,
      dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      gender,
      imageUrl,
    };

    if (userInfo && userInfo._id) {
      dispatch(updateUserInfo({ userId: userInfo._id, userData: updatedData }));
      setIsSaved(true);
      setHasChanges(false);
    }
  };

  const handleNext = () => {
    navigation.navigate("HealthInfo");
  };

  const handleInputChange = (value, setter) => {
    setter(value);
    setIsSaved(false);
    setHasChanges(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    handleInputChange(currentDate, setDateOfBirth);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.innerContainer}
    >
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.profileIcon}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          ) : (
            <Icon name="user-circle" size={100} color="#888" />
          )}
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={(value) => handleInputChange(value, setFirstName)}
        />
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(value) => handleInputChange(value, setLastName)}
        />
        <Text style={styles.label}>Date of Birth:</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {dateOfBirth.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.label}>Gender:</Text>
        <Picker
          selectedValue={gender}
          style={styles.input}
          onValueChange={(itemValue) => handleInputChange(itemValue, setGender)}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>

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
      </View>
    </ScrollView>
  );
};

export default BasicInfoScreen;
