import React, { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../../../redux/features/user/userSlice";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "./HoroscopeDetailsScreenStyle"; // Importation des styles depuis le fichier séparé

const HoroscopeDetailsScreen = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [starAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchUser = async () => {
      const userId = userInfo?._id;
      if (userId) {
        dispatch(fetchUserInfo(userId));
      }
    };
    fetchUser();
    // Animation des étoiles
    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(starAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [dispatch, userInfo?._id, starAnimation]);

  const starStyle = {
    opacity: starAnimation,
    transform: [
      {
        scale: starAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        <Animated.View
          style={[styles.starContainer, starStyle, { top: 20, left: 50 }]}
        >
          <FontAwesome name="star" size={30} color="#f5f5f5" />
        </Animated.View>
        <Animated.View
          style={[styles.starContainer, starStyle, { top: 80, left: 200 }]}
        >
          <FontAwesome name="star" size={30} color="#f5f5f5" />
        </Animated.View>
        <Animated.View
          style={[styles.starContainer, starStyle, { top: 150, left: 100 }]}
        >
          <FontAwesome name="star" size={30} color="#f5f5f5" />
        </Animated.View>
      </View>
      <Text style={styles.title}>
        Horoscope pour {userInfo?.zodiacSign || "Inconnu"}
      </Text>
      {userInfo?.horoscope ? (
        <Text style={styles.horoscopeText}>{userInfo.horoscope}</Text>
      ) : (
        <Text style={styles.horoscopeText}>Horoscope indisponible</Text>
      )}
    </View>
  );
};

export default HoroscopeDetailsScreen;
