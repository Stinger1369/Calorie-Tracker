import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  exerciseInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabIndicator: {
    backgroundColor: '#FFF',
    width: '100%',
  },
  monthTabBar: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  sessionTabBar: {
    backgroundColor: 'transparent',
  },
  tabStyle: {
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sessionTabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
 containerMonth: {
    flexDirection: 'row', // Organise les boutons de mois en ligne
    justifyContent: 'space-between', // Distribution égale des boutons
  },
   containerSession: {
    flexDirection: 'row', // Organise les boutons de séance en ligne
    justifyContent: 'space-between', // Distribution égale des boutons
  },
});

export default styles;