import React, {useEffect} from 'react';
import {View, Text, Button, ActivityIndicator, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchUserInfo,
  updateUserInfo,
  deleteUser,
} from '../../../redux/features/user/userSlice';

const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const {userInfo, loading, error} = useSelector(state => state.user);
  const {user} = useSelector(state => state.auth);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let userId = user?._id;

        if (!userId) {
          const storedUser = await AsyncStorage.getItem('user');
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          userId = parsedUser?._id;
        }

        if (userId) {
          dispatch(fetchUserInfo(userId));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, [dispatch, user]);

  const handleUpdateUser = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleDeleteUser = () => {
    if (userInfo && userInfo._id) {
      dispatch(deleteUser(userInfo._id));
    }
  };

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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.label}>
            Name: {userInfo.firstName} {userInfo.lastName}
          </Text>
          <Text style={styles.label}>Email: {userInfo.email}</Text>
          {/* Afficher d'autres informations utilisateur ici */}

          <Button title="Edit Profile" onPress={handleUpdateUser} />
          <Button title="Delete User" onPress={handleDeleteUser} color="red" />
        </>
      ) : (
        <Text style={styles.errorText}>No user information available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Profile;
