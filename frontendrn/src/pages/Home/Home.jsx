import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue sur la page d'accueil !</Text>
      <Button
        title="Se déconnecter"
        onPress={() => navigation.navigate('Logout')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Home;
