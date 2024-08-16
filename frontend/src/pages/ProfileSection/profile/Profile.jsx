import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserInfo } from "../../../redux/features/user/userSlice";
import { restoreToken } from "../../../redux/features/auth/authSlice";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./ProfileStyles";
import moment from "moment";
import { calculateIMC } from "./Imc/calculateIMC";
import StepCounter from "../../../components/StepCount/StepCounter";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.user);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let userId = user?._id;
        let storedToken = token;

        if (!userId || !storedToken) {
          const storedUser = await AsyncStorage.getItem("user");
          storedToken = await AsyncStorage.getItem("token");

          if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser?._id;

            dispatch(restoreToken({ user: parsedUser, token: storedToken }));
          }
        }

        if (userId) {
          dispatch(fetchUserInfo(userId));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, [dispatch, user, token]);

  const handleUpdateUser = () => {
    navigation.navigate("ProfileEdit");
  };

  const handleIMCPress = () => {
    if (userInfo && userInfo.bmi) {
      navigation.navigate("IMCDetails", { imc: userInfo.bmi });
    } else {
      console.error("BMI or user information is not available.");
    }
  };

  const currentDate = moment().format("dddd, DD MMMM");

  const renderProfileIcon = () => {
    if (userInfo?.imageUrl) {
      return (
        <Image
          source={{ uri: userInfo.imageUrl }}
          style={styles.profileImage}
        />
      );
    } else {
      switch (userInfo?.gender) {
        case "male":
          return <Icon name="male" size={50} color="#888" />;
        case "female":
          return <Icon name="female" size={50} color="#888" />;
        case "other":
          return <Icon name="genderless" size={50} color="#888" />;
        default:
          return <Icon name="user-circle" size={50} color="#888" />;
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user information available.</Text>
      </View>
    );
  }

  const imc = userInfo.bmi || calculateIMC(userInfo.weight, userInfo.height);
  const recommendedCalories = userInfo.recommendedCalories
    ? `${Math.round(userInfo.recommendedCalories)} Kcal`
    : "N/A";

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          {renderProfileIcon()}
          <View style={styles.greetingContainer}>
            <Text style={styles.welcomeText}>Hello {userInfo.firstName}!</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleUpdateUser}
          style={styles.editIconContainer}
        >
          <Icon name="edit" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Today's Information</Text>
        <Text style={styles.sectionDate}>July, 2021</Text>
      </View>

      <View style={styles.infoCardsContainer}>
        <View style={styles.infoCard}>
          <Icon name="fire" size={24} color="#FFA726" />
          <Text style={styles.infoCardValue}>{recommendedCalories}</Text>
          <Text style={styles.infoCardTitle}>Kcal</Text>
        </View>
        <View style={styles.infoCard}>
          <Icon name="heartbeat" size={24} color="#FF4081" />
          <Text style={styles.infoCardValue}>
            {userInfo.heartRate || "N/A"}
          </Text>
          <Text style={styles.infoCardTitle}>bpm</Text>
        </View>
        <View style={styles.infoCard}>
          <Icon name="walking" size={24} color="#7E57C2" />
          <StepCounter userId={user._id} />
        </View>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionText}>Invite your friends</Text>
        <Text style={styles.actionSubText}>
          Invite your friends to get a free exercise right away
        </Text>
      </View>

      <TouchableOpacity onPress={handleIMCPress} style={styles.imcContainer}>
        <Text style={styles.imcText}>
          Height: {userInfo.height} cm | Weight: {userInfo.weight} kg | IMC:{" "}
          {imc}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
