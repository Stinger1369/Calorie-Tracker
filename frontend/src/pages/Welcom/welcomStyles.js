import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e', // Fond sombre pour un effet élégant
    padding: wp('5%'), // Utilisation de 5% de la largeur de l'écran pour le padding
  },
  welcomeText: {
    fontSize: wp('7%'), // Ajustement de la taille du texte en fonction de la largeur de l'écran
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: hp('5%'), // Ajustement de l'espacement en fonction de la hauteur
    fontFamily: 'Avenir-Heavy',
  },
  loader: {
    marginBottom: hp('4%'), // Espacement proportionnel
  },
  button: {
    backgroundColor: '#ff9500',
    paddingVertical: hp('2.5%'), // Ajustement de la hauteur du padding en fonction de la hauteur de l'écran
    paddingHorizontal: wp('12%'), // Ajustement de la largeur du padding
    borderRadius: wp('10%'), // Bordure arrondie avec une proportion adaptée
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5, // Ombre pour Android
  },
  buttonText: {
    color: '#ffffff',
    fontSize: wp('5%'), // Ajustement de la taille du texte en fonction de la largeur
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
  },
});

export default styles;
