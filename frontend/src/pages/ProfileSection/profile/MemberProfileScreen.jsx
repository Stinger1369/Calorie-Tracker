import React, { useEffect } from "react";
import { ScrollView, View, Text, ActivityIndicator, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../../../redux/features/user/userSlice";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Utiliser l'icône FontAwesome
import styles from "./MemberProfileStyles";

const MemberProfileScreen = ({ route }) => {
  const { memberId } = route.params; // Get memberId passed via navigation
  const dispatch = useDispatch();

  const { userInfo, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (memberId) {
      dispatch(fetchUserInfo(memberId)); // Fetch the selected member's info
    }
  }, [dispatch, memberId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucune information sur l'utilisateur.</Text>
      </View>
    );
  }

  const renderProfileImage = () => {
    if (userInfo?.imageUrl) {
      return <Image source={{ uri: userInfo.imageUrl }} style={styles.profileImage} />;
    } else {
      return (
        <FontAwesome
          name={userInfo.gender === "male" ? "male" : userInfo.gender === "female" ? "female" : "user-circle"}
          size={80}
          color="#888"
          style={styles.profileImageIcon}
        />
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {renderProfileImage()}
        {/* Affiche le prénom et le nom */}
        <Text style={styles.nameText}>{userInfo.firstName} {userInfo.lastName}</Text>
      </View>
    </ScrollView>
  );
};

export default MemberProfileScreen;
