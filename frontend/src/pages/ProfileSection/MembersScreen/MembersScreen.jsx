import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../../redux/features/user/userSlice';
import UserCard from '../../../components/UserCard/UserCard';
import styles from './MembersScreenStyles';

const MembersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, members, error } = useSelector(state => state.user);
  const { user: loggedInUser } = useSelector(state => state.auth); // Utilisateur connecté

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleUserPress = (memberId) => {
    if (loggedInUser && loggedInUser._id === memberId) {
      // Si c'est l'utilisateur connecté, rediriger vers son profil
      navigation.navigate('ProfileTab');
    } else {
      // Sinon, rediriger vers le profil du membre
      navigation.navigate('MemberProfileScreen', { memberId });
    }
  };

  const renderUserCard = ({ item }) => (
    <UserCard
      user={item}
      onPress={() => handleUserPress(item._id)} // Utiliser la fonction handleUserPress
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        keyExtractor={item => item._id}
        renderItem={renderUserCard}
      />
    </View>
  );
};

export default MembersScreen;
