// MinutePicker.js
import React from 'react';
import { View, Text } from 'react-native';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import minuteStyles from './MinutePickerStyle'; // Style spécifique au picker des minutes

const MinutePicker = ({ selectedMinutes, setSelectedMinutes }) => {
  const itemHeight = 40; // Hauteur de chaque élément
  const visibleItems = 2; // Nombre d'éléments visibles

  // Fonction pour rendre les placeholders (espaces en haut et en bas)
  const renderPlaceHolder = () => {
    const h = (itemHeight * visibleItems - itemHeight) / 2;
    return {
      header: <View style={{ height: h, flex: 1 }} />,
      footer: <View style={{ height: h, flex: 1 }} />,
    };
  };

  const { header, footer } = renderPlaceHolder(); // Calculer les placeholders

  return (
    <View style={minuteStyles.pickerColumn}>
      <Text style={minuteStyles.subtitle}>Choisissez le nombre de minutes :</Text>
      <ScrollPicker
        dataSource={[...Array(60).keys()].map((i) => `${i + 1} minute(s)`)}
        selectedIndex={selectedMinutes - 1}
        wrapperHeight={itemHeight * visibleItems} // Ajustement exact pour les éléments visibles
        itemHeight={itemHeight} // Hauteur d'un seul élément
        highlightColor="#f0f0f0"
        highlightBorderWidth={1}
        wrapperBackground="transparent"
        itemTextStyle={{ color: '#333', fontSize: 20, textAlign: 'center', lineHeight: itemHeight }} // Alignement du texte
        activeItemTextStyle={{ color: '#000', fontSize: 24, fontWeight: 'bold', textAlign: 'center', lineHeight: itemHeight }} // Alignement du texte actif
        renderIndicator={false}
        onValueChange={(data, selectedIndex) => setSelectedMinutes(selectedIndex + 1)}
      >
        {header}
        {footer}
      </ScrollPicker>
    </View>
  );
};

export default MinutePicker;
