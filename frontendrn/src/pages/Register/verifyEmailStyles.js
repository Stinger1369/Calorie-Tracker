import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 20,
    textAlign: 'center',
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
    backgroundColor: '#ffffff',
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  resendButton: {
    backgroundColor: '#e67e22', // Different color for the resend button
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
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
