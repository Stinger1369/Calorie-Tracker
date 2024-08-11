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
import styles from "./AdditionalInfoScreenStyle";

const AdditionalInfoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [ethnicity, setEthnicity] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [livingEnvironment, setLivingEnvironment] = useState("");
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [mentalHealthStatus, setMentalHealthStatus] = useState("");

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
        ethnicity: userInfo.ethnicity || "",
        address: userInfo.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
        livingEnvironment: userInfo.livingEnvironment || "",
        fitnessGoals: userInfo.fitnessGoals || "",
        hobbies: userInfo.hobbies?.join(", ") || "",
        mentalHealthStatus: userInfo.mentalHealthStatus || "",
      };
      setEthnicity(initialData.ethnicity);
      setAddress(initialData.address);
      setLivingEnvironment(initialData.livingEnvironment);
      setFitnessGoals(initialData.fitnessGoals);
      setHobbies(initialData.hobbies);
      setMentalHealthStatus(initialData.mentalHealthStatus);
      setInitialValues(initialData);
      setIsSaved(true);
    }
  }, [userInfo]);

  const hasChanges = () => {
    return (
      ethnicity !== initialValues.ethnicity ||
      JSON.stringify(address) !== JSON.stringify(initialValues.address) ||
      livingEnvironment !== initialValues.livingEnvironment ||
      fitnessGoals !== initialValues.fitnessGoals ||
      hobbies !== initialValues.hobbies ||
      mentalHealthStatus !== initialValues.mentalHealthStatus
    );
  };

  const handleSave = () => {
    const updatedData = {
      ethnicity,
      address,
      livingEnvironment,
      fitnessGoals,
      hobbies: hobbies.split(",").map((item) => item.trim()),
      mentalHealthStatus,
    };

    if (userInfo && userInfo._id) {
      dispatch(updateUserInfo({ userId: userInfo._id, userData: updatedData }));
      setInitialValues(updatedData);
      setIsSaved(true);

      navigation.navigate("ProfileTab");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Ethnicity:</Text>
        <TextInput
          style={styles.input}
          value={ethnicity}
          onChangeText={(value) => setEthnicity(value)}
        />
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="Street"
          value={address.street}
          onChangeText={(value) =>
            setAddress((prev) => ({ ...prev, street: value }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={address.city}
          onChangeText={(value) =>
            setAddress((prev) => ({ ...prev, city: value }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          value={address.state}
          onChangeText={(value) =>
            setAddress((prev) => ({ ...prev, state: value }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Country"
          value={address.country}
          onChangeText={(value) =>
            setAddress((prev) => ({ ...prev, country: value }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          value={address.postalCode}
          onChangeText={(value) =>
            setAddress((prev) => ({ ...prev, postalCode: value }))
          }
        />
        <Text style={styles.label}>Living Environment:</Text>
        <TextInput
          style={styles.input}
          value={livingEnvironment}
          onChangeText={(value) => setLivingEnvironment(value)}
        />
        <Text style={styles.label}>Fitness Goals:</Text>
        <TextInput
          style={styles.input}
          value={fitnessGoals}
          onChangeText={(value) => setFitnessGoals(value)}
        />
        <Text style={styles.label}>Hobbies (comma separated):</Text>
        <TextInput
          style={styles.input}
          value={hobbies}
          onChangeText={(value) => setHobbies(value)}
        />
        <Text style={styles.label}>Mental Health Status:</Text>
        <TextInput
          style={styles.input}
          value={mentalHealthStatus}
          onChangeText={(value) => setMentalHealthStatus(value)}
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
            style={styles.finishButton}
            onPress={handleSave}
            disabled={!isSaved}
          >
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdditionalInfoScreen;
