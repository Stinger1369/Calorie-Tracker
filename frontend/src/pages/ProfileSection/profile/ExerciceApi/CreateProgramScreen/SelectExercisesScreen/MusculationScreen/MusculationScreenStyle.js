import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  muscleGroupsContainer: {
    marginVertical: 15,
    paddingVertical: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  muscleGroupButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,  // Garder le padding vertical raisonnable
    paddingHorizontal: 20,  // Assurer que le texte a suffisamment d'espace horizontal
    borderRadius: 20,
    marginHorizontal: 5,  // Ajuster la marge pour un bon espacement entre les boutons
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,  // Largeur minimale pour éviter que le texte soit coupé
    maxWidth: 150,  // Largeur maximale pour les groupes musculaires avec des noms plus longs
  },
  muscleGroupButtonText: {
    color: '#fff',
    fontSize: 14,  // Taille de police légèrement réduite pour s'adapter à des boutons plus petits
    fontWeight: '500',
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  submitButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
