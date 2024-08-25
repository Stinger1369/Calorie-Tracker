import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserInfo,
  fetchUserInfo,
} from "../../../../redux/features/user/userSlice";
import { uploadImage } from "../../../../redux/features/imageSlice/imageSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageSelector from "../../../../components/ImageSelector/ImageSelector";
import styles from "./BasicInfoScreenStyle";

const BasicInfoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const { imageUrl: uploadedImageUrl } = useSelector((state) => state.image);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [localImageUri, setLocalImageUri] = useState(null); // Stocker l'image sélectionnée localement

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

  useEffect(() => {
    if (uploadedImageUrl) {
      setImageUrl(uploadedImageUrl);
      setHasChanges(true); // Marquer le formulaire comme modifié
    }
  }, [uploadedImageUrl]);

  const handleSave = async () => {
    let finalImageUrl = imageUrl;

    if (localImageUri) {
      // Upload de l'image sélectionnée
      await dispatch(
        uploadImage({
          userId: userInfo._id,
          imageBuffer: { uri: localImageUri },
        })
      ).then((action) => {
        if (action.payload) {
          finalImageUrl = action.payload;
        }
      });
    }

    const updatedData = {
      firstName,
      lastName,
      dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      gender,
      imageUrl: finalImageUrl,
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

  const handleImageSelected = (uri) => {
    setLocalImageUri(uri); // Stocker l'URI de l'image localement pour l'utiliser lors du save
    setHasChanges(true); // Marquer le formulaire comme modifié
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.innerContainer}
    >
      <ImageSelector onImageSelected={handleImageSelected} />
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
            style={[
              styles.saveButton,
              { backgroundColor: hasChanges ? "#4CAF50" : "#ccc" },
            ]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: isSaved ? "#2196F3" : "#ccc" },
            ]}
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
