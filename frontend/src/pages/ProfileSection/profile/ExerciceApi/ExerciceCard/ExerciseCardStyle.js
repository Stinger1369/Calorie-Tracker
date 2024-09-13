import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 50,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: screenWidth / 3,
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
    borderRadius: 20,
  },
  right: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  textContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startButton: {
    backgroundColor: '#28a745',
    flex: 1,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButton: {
    backgroundColor: '#007BFF',
    flex: 1,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  likeDislikeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  dislikeButton: {
    marginLeft: 10,
  },
});

export default styles;
