// MinutePickerStyle.js
import { StyleSheet } from 'react-native';

const minuteStyles = StyleSheet.create({
  pickerColumn: {
    flex: 1,
    height: 200,
    marginHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  subtitle: {
    fontSize: 20,
    color: '#CCCCCC',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default minuteStyles;
