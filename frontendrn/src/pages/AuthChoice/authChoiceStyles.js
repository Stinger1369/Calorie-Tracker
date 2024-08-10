import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light, neutral background
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50', // Darker blue-gray for the title
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Avenir-Heavy',
  },
  userData: {
    fontSize: 20,
    color: '#27ae60', // Soft green for a healthy and fresh look
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d', // Soft gray for the subtitle
    textAlign: 'center',
    marginBottom: 50,
    fontFamily: 'Avenir-Medium',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#3498db', // Calm blue for the login button
    paddingVertical: 15,
    paddingHorizontal: width * 0.2, // Responsive button width
    borderRadius: 30,
    marginHorizontal: 10,
  },
  registerButton: {
    backgroundColor: '#e74c3c', // Warm red for the register button
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
  },
});
