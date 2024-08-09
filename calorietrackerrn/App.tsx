import React from 'react';
import {Provider} from 'react-redux';
import store from './src/redux/store/store';
import {SafeAreaView, Text} from 'react-native';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView>
        <Text>Bienvenue dans l'application Calorie Tracker!</Text>
        {/* Vous pouvez ici ajouter vos composants ou navigations */}
      </SafeAreaView>
    </Provider>
  );
};

export default App;
