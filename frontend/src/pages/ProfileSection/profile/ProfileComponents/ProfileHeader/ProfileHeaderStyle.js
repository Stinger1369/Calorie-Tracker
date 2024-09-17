import { StyleSheet } from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp('2%'),
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp('2%'),
  },
  profileImage: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    marginRight: wp('3%'),
  },
  greetingContainer: {
    flexDirection: "column",
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: wp('5%'),
    fontWeight: "bold",
    marginLeft: wp('5%'),
  },
  dateText: {
    color: "#AAAAAA",
    fontSize: wp('3.5%'),
    marginLeft: wp('5%'),
  },
  editIconContainer: {
    padding: wp('1%'),
    backgroundColor: "#292929",
    borderRadius: wp('3%'),
  },
});

export default styles;

