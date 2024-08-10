import React, {useEffect} from 'react';
import {View, Text, Button, ActivityIndicator, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchUserInfo,
  updateUserInfo,
  deleteUser,
} from '../../redux/features/user/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const {userInfo, loading, error} = useSelector(state => state.user);
  const {user} = useSelector(state => state.auth);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Vérifiez si l'utilisateur est présent dans le state auth
        let userId = user?._id;

        console.log('Checking auth state for user data...');
        console.log('User ID from auth state:', userId);

        // Si l'utilisateur est trouvé, récupérer les informations détaillées
        if (userId) {
          console.log('Fetching user info from API for user ID:', userId);
          dispatch(fetchUserInfo(userId));
        } else {
          console.log('No user ID found.');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, [dispatch, user]);

  const handleUpdateUser = () => {
    const updatedData = {
      firstName: 'NewFirstName',
      lastName: 'NewLastName',
    };
    if (userInfo && userInfo._id) {
      console.log('Updating user info with ID:', userInfo._id);
      dispatch(updateUserInfo({userId: userInfo._id, userData: updatedData}));
    } else {
      console.log('No user info available for update.');
    }
  };

  const handleDeleteUser = () => {
    if (userInfo && userInfo._id) {
      console.log('Deleting user with ID:', userInfo._id);
      dispatch(deleteUser(userInfo._id));
    } else {
      console.log('No user info available for deletion.');
    }
  };

  if (loading) {
    console.log('Loading user data...');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    console.error('Error fetching user data:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  console.log('User info:', userInfo);

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

          <Button title="Update User" onPress={handleUpdateUser} />
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
