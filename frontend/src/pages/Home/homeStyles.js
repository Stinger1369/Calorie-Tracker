import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background for a clean look
    padding: 20,
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  iconContainer: {
    padding: 10,
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333', // Dark grey text for readability
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Avenir-Medium', // Professional and clean font
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
