import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Contact = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contact Page</Text>
      <Text style={styles.description}>
        This is the contact page of the application.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Contact;
