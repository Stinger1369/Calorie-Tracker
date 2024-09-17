import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: screenWidth / 3, // Image takes up 1/3 of the card's width
    height: screenWidth / 3,
    borderTopLeftRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
  },
  right: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 15,
  },
  textContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  selectedCard: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00ACC1',
    borderWidth: 2,
  },
});

export default styles;
