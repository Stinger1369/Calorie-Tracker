// ExerciseDetailsScreenStyle.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  instructionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginVertical: 12,
  },
  tipsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#32CD32',
    marginVertical: 12,
  },
  listItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  repsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  repsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  repsText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 16,
    color: '#FF4500',
    textAlign: 'center',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
});
