import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    width: width,
    zIndex: 1000,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  iconText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  triangleContainer: {
    position: 'absolute',
    bottom: 90, // Ajuster selon l'apparence souhaitée
    left: '50%',
    transform: [{translateX: -15}],
    zIndex: 1000,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#007AFF',
  },
});
