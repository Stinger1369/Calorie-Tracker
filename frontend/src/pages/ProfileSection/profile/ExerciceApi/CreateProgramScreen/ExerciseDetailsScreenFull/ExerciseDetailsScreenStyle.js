import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',  // Couleur de fond douce pour le contraste
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',  // Texte sombre pour un bon contraste
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',  // Encadrement léger autour de l'image
    shadowColor: "#000",  // Ombre pour donner du relief
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,  // Pour une ombre sous Android
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 20,
    color: '#555',  // Texte plus clair pour la description
    textAlign: 'justify',
  },
  instructionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E90FF',  // Couleur bleu vif pour les titres
  },
  listItem: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',  // Texte sombre
    paddingLeft: 10,  // Indentation pour les éléments de la liste
  },
  repsContainer: {
    marginVertical: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  repsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FF6347',  // Couleur rouge-orangé pour attirer l'attention
  },
  repsText: {
    fontSize: 18,
    marginBottom: 6,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Couleur de fond avec transparence
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    elevation: 8,  // Pour un effet de relief du bouton
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347',  // Couleur du texte du bouton
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
});
