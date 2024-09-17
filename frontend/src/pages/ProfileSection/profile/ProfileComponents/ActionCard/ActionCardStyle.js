import { StyleSheet } from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  actionCard: {
    backgroundColor: "#292929",
    padding: wp('5%'), // Utilisation de 5% de la largeur de l'écran
    borderRadius: wp('3%'),
    alignItems: "center",
    marginBottom: hp('2%'),
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: wp('4.5%'), // Ajustement de la taille de police par rapport à la largeur de l'écran
    fontWeight: "bold",
    marginBottom: hp('1%'),
  },
  actionSubText: {
    color: "#AAAAAA",
    fontSize: wp('3.5%'),
    textAlign: "center",
  },
  imcContainer: {
    padding: wp('5%'),
    backgroundColor: "#1D233F",
    borderRadius: wp('3%'),
    alignItems: "center",
  },
  imcText: {
    color: "#FFFFFF",
    fontSize: wp('4%'),
  },
});

export default styles;

