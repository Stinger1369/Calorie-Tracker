import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  uploadImage,
  resetImageState,
} from "../../redux/features/imageSlice/imageSlice";
import styles from "./ImageSelectorStyle"; // Ensure you have this styles file

const ImageSelector = () => {
  const dispatch = useDispatch();
  const { imageUrl, loading, error } = useSelector((state) => state.image);
  const { user } = useSelector((state) => state.auth); // Retrieve the user from Redux
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      console.log("Fetching user ID...");
      if (user && user._id) {
        console.log("User ID from Redux:", user._id);
        setUserId(user._id); // If the user is in Redux, use it
      } else {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("User ID from AsyncStorage:", parsedUser._id);
          setUserId(parsedUser._id); // If the user is in AsyncStorage, use it
        }
      }
    };

    fetchUserId();
  }, [user]);

  const selectImage = async () => {
    if (!userId) {
      console.error("User ID is not defined. Please ensure it's available.");
      return;
    }

    console.log("Requesting media library permissions...");
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (libraryStatus !== "granted" || cameraStatus !== "granted") {
      console.log("Permissions not granted");
      Alert.alert(
        "Permissions required",
        "We need permission to access your camera and photo library."
      );
      return;
    }

    console.log("Showing image selection options...");
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: openCamera,
        },
        {
          text: "Library",
          onPress: openImageLibrary,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const openImageLibrary = async () => {
    console.log("Opening image library...");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image selected:", result.assets[0].uri);
      dispatch(
        uploadImage({ userId, imageBuffer: { uri: result.assets[0].uri } })
      );
    } else {
      console.log("Image selection canceled");
    }
  };

  const openCamera = async () => {
    console.log("Opening camera...");
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image captured:", result.assets[0].uri);
      dispatch(
        uploadImage({ userId, imageBuffer: { uri: result.assets[0].uri } })
      );
    } else {
      console.log("Camera capture canceled");
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity style={styles.profileIcon} onPress={selectImage}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.profileImage} />
        ) : (
          <Icon name="user-circle" size={100} color="#888" />
        )}
      </TouchableOpacity>
      <Text style={styles.imageHint}>Tap to change profile picture</Text>
      {error && (
        <Text style={styles.errorText}>
          {typeof error === "string" ? error : error.message || "Unknown error"}
        </Text>
      )}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => dispatch(resetImageState())}
      >
        <Text style={styles.resetButtonText}>Reset Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageSelector;
