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
import styles from "./ImageSelectorStyle";

const ImageSelector = ({ onImageSelected }) => {
  const { userInfo } = useSelector((state) => state.user); // Récupération depuis le slice user
  const [userId, setUserId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Pour l'aperçu local de l'image

  useEffect(() => {
    const fetchUserId = async () => {
      if (userInfo && userInfo._id) {
        setUserId(userInfo._id);
      } else {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserId(parsedUser._id);
        }
      }
    };

    fetchUserId();
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.imageUrl) {
      setPreviewImage(userInfo.imageUrl);
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
      setPreviewImage(result.assets[0].uri);
      onImageSelected(result.assets[0].uri); // Informer le parent de l'image sélectionnée
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
      onImageSelected(result.assets[0].uri); // Informer le parent de l'image sélectionnée
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileIcon} onPress={selectImage}>
        {previewImage ? (
          <Image source={{ uri: previewImage }} style={styles.profileImage} />
        ) : (
          <Icon name="user-circle" size={100} color="#888" />
        )}
      </TouchableOpacity>
      <Text style={styles.imageHint}>Tap to change profile picture</Text>
    </View>
  );
};

export default ImageSelector;
