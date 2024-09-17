import { StyleSheet } from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  infoCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: hp('2%'),
  },
  leftColumn: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: wp('2.5%'),
    width: "100%",
  },
  rightColumn: {
  flex: 1,
  justifyContent: "center",
  marginRight: wp('10%'), // Réduire la marge pour les écrans larges
  width: "100%",
},

caloriesCard: {
  backgroundColor: "#FF6347",
  borderRadius: wp('5%'),
  alignItems: "center",
  borderWidth: 2,
  borderColor: "#FFFFFF",
  padding: hp('2%'),
  width: wp('35%'), // Augmenter la largeur
  height: hp('18%'), // Augmenter légèrement la hauteur
},
stepsCard: {
  backgroundColor: "#4682B4",
  borderRadius: wp('5%'),
  padding: hp('2%'),
  alignItems: "center",
  borderWidth: 2,
  borderColor: "#FFFFFF",
  width: wp('35%'), // Ajustement similaire
  height: hp('18%'),
},

bpmCard: {
  backgroundColor: "#1E2132",
  borderRadius: wp('5%'),
  padding: hp('2%'),
  alignItems: "center",
  marginBottom: hp('1%'),
  borderWidth: 2,
  borderColor: "#FFFFFF",
  width: "120%",
  overflow: "hidden", // Empêche les débordements
},


  heartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
   },
  heartTitle: {
    color: "#FFFFFF",
    fontSize: wp('4%'),
    fontWeight: "bold",
  },
  heartRateValue: {
    color: "#FFFFFF",
    fontSize: wp('6%'),
    fontWeight: "bold",
    marginTop: hp('1%'),
  },
});

export default styles;

