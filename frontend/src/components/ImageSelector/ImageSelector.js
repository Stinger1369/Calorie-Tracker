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
import styles from "./ImageSelectorStyle";

const ImageSelector = () => {
  const dispatch = useDispatch();
  const { imageUrl, loading, error } = useSelector((state) => state.image);
  const { userInfo } = useSelector((state) => state.user); // Récupération depuis le slice user
  const [userId, setUserId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Pour l'aperçu local de l'image

  useEffect(() => {
    const fetchUserId = async () => {
      console.log("Fetching user ID...");
      if (userInfo && userInfo._id) {
        console.log("User ID from Redux (userInfo):", userInfo._id);
        setUserId(userInfo._id);
      } else {
        console.log("User info not found in Redux, checking AsyncStorage...");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("User ID from AsyncStorage:", parsedUser._id);
          setUserId(parsedUser._id);
        } else {
          console.log("No user found in AsyncStorage either.");
        }
      }
    };

    fetchUserId();
  }, [userInfo]);

  useEffect(() => {
    // Utiliser l'image récupérée depuis le backend si elle existe
    if (userInfo && userInfo.imageUrl) {
      console.log("Image URL from userInfo:", userInfo.imageUrl);
      setPreviewImage(userInfo.imageUrl);
    } else {
      console.log("No image URL found in userInfo.");
    }
  }, [userInfo]);

  const selectImage = async () => {
    if (!userId) {
      console.error("User ID is not defined. Please ensure it's available.");
      return;
    }

    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (libraryStatus !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Permissions required",
        "We need permission to access your camera and photo library."
      );
      return;
    }

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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image selected from library:", result.assets[0].uri);
      setPreviewImage(result.assets[0].uri);
      dispatch(
        uploadImage({ userId, imageBuffer: { uri: result.assets[0].uri } })
      );
    } else {
      console.log("Image selection canceled.");
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image captured from camera:", result.assets[0].uri);
      setPreviewImage(result.assets[0].uri);
      dispatch(
        uploadImage({ userId, imageBuffer: { uri: result.assets[0].uri } })
      );
    } else {
      console.log("Camera capture canceled.");
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity style={styles.profileIcon} onPress={selectImage}>
        {previewImage || imageUrl ? (
          <Image
            source={{ uri: previewImage || imageUrl }}
            style={styles.profileImage}
          />
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
        onPress={() => {
          dispatch(resetImageState());
          setPreviewImage(null);
        }}
      >
        <Text style={styles.resetButtonText}>Reset Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageSelector;
