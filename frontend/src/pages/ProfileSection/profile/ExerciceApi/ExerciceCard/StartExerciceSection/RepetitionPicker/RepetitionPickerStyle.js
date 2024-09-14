// RepetitionPickerStyle.js
import { StyleSheet } from 'react-native';

const repetitionStyles = StyleSheet.create({
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  pickerColumn: {
    flex: 1,
    height: 130,
    marginHorizontal: 12,
    backgroundColor: 'gray',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default repetitionStyles;
