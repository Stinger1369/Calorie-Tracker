import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light, neutral background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50', // Darker blue-gray for the title
    marginBottom: 20,
    fontFamily: 'Avenir-Heavy',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff', // White background for input fields
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db', // Calm blue for the primary button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
  },
  forgotButton: {
    marginTop: 20,
  },
  forgotButtonText: {
    color: '#e74c3c', // Soft red for the forgot password link
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
  },
});
