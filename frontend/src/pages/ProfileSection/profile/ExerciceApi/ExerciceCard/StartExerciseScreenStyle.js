import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E0E0E', // Fond sombre futuriste
    padding: 20,
  },
  imageBackground: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    backgroundColor: '#141414', // Fond noir profond
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: '#00FF99', // Effet néon vert
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF', // Texte blanc futuriste
    textAlign: 'center',
    textShadowColor: '#00FF99', // Effet néon sur le titre
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#AAAAAA', // Texte gris léger
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    borderColor: '#00FF99', // Bordure néon
    borderWidth: 1,
    shadowColor: '#00FF99', // Effet lumineux vert néon
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  selectedButton: {
    backgroundColor: '#00FF99', // Sélectionné en vert néon
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: '#00FF99', // Effet néon sur le texte
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timer: {
    fontSize: 20,
    color: '#00FF99', // Couleur néon pour le timer
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: '#00FF99',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  countdown: {
  fontSize: 48,
  color: '#00FF99',
  textAlign: 'center',
  marginTop: 20,
  fontWeight: 'bold',
},
startButton: {
  backgroundColor: '#00FF99',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginTop: 20,
  shadowColor: '#00FF99',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 1,
  shadowRadius: 10,
},

  picker: {
    height: 50,
    width: 150,
    backgroundColor: '#333333', // Fond sombre pour le picker
    color: '#00FF99', // Texte néon
    borderRadius: 10,
  },
});

export default styles;
