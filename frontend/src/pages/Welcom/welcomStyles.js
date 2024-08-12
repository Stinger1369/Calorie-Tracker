import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e', // Dark background for a luxurious feel
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', // White text for contrast
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Avenir-Heavy', // Custom font for a modern touch
  },
  loader: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ff9500', // Elegant orange button
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Avenir-Medium', // Same font family, different weight
  },
});

export default styles;
