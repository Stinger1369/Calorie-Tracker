import React from 'react';
import { View, Text } from 'react-native';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import repetitionStyles from './RepetitionPickerStyle';

const RepetitionPicker = ({ repetitionCount, setRepetitionCount, multiplier, setMultiplier }) => {
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
    <View style={repetitionStyles.pickerRow}>
      {/* Picker pour le nombre de répétitions */}
      <View style={repetitionStyles.pickerColumn}>
        <Text style={repetitionStyles.subtitle}>Nombre de répétitions :</Text>
        <ScrollPicker
          dataSource={[...Array(6).keys()].map((i) => `${10 + i} `)} // 6 valeurs de 10 à 15
          selectedIndex={repetitionCount - 10}
          wrapperHeight={itemHeight * visibleItems} // Ajustement exact pour 3 éléments visibles
          itemHeight={itemHeight} // Hauteur d'un seul élément
          highlightColor="gray"
          highlightBorderWidth={2}
          wrapperBackground="transparent"
          itemTextStyle={{ color: '#333', fontSize: 22, textAlign: 'center', lineHeight: itemHeight }} // Alignement du texte
          activeItemTextStyle={{ color: '#000', fontSize: 30, fontWeight: 'bold', textAlign: 'center', lineHeight: itemHeight }} // Alignement du texte
          renderIndicator={false}
          onValueChange={(data) => {
            setRepetitionCount(parseInt(data, 10));
          }}
        >
          {header}
          {footer}
        </ScrollPicker>
      </View>

      {/* Picker pour multiplier les répétitions */}
      <View style={repetitionStyles.pickerColumn}>
        <Text style={repetitionStyles.subtitle}>Multiplier les répétitions :</Text>
        <ScrollPicker
          dataSource={[...Array(20).keys()].map((i) => `x${i + 1}`)} // 20 valeurs de x1 à x20
          selectedIndex={multiplier - 1}
          wrapperHeight={itemHeight * visibleItems} // Ajustement exact pour 3 éléments visibles
          itemHeight={itemHeight} // Hauteur d'un seul élément
          highlightColor="gray"
          highlightBorderWidth={1}
          wrapperBackground="transparent"
          itemTextStyle={{ color: '#333', fontSize: 22, textAlign: 'center', lineHeight: itemHeight }} // Alignement du texte
          activeItemTextStyle={{ color: '#000', fontSize: 30, fontWeight: 'bold', textAlign: 'center', lineHeight: itemHeight }} // Alignement du texte
          renderIndicator={false}
          onValueChange={(data, selectedIndex) => {
            setMultiplier(selectedIndex + 1);
          }}
        >
          {header}
          {footer}
        </ScrollPicker>
      </View>
    </View>
  );
};

export default RepetitionPicker;
