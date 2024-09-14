import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 20,
  },
  imageBackground: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.35,
    backgroundColor: '#0F0F0F',
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: '#00FF99',
    borderWidth: 3,
    shadowColor: '#00FF99',
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#00FF99',
    textShadowRadius: 10,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 20,
    color: '#CCCCCC',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    marginHorizontal: 10,
    borderColor: '#00FF99',
    borderWidth: 1.5,
    shadowColor: '#00FF99',
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  selectedButton: {
    backgroundColor: '#00FF99',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#00FF99',
    textShadowRadius: 10,
  },
  timer: {
    fontSize: 24,
    color: '#00FF99',
    textAlign: 'center',
    marginTop: 15,
  },
  countdown: {
    fontSize: 50,
    color: '#00FF99',
    textAlign: 'center',
    marginTop: 25,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#00FF99',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 14,
    marginTop: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%', // S'assurer que les trois boutons tiennent dans la ligne
    marginTop: 25,
  },
  pauseButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  resetButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  validateButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },

});

export default styles;
