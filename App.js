import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';

import { loadFonts } from "./src/service/applicable/Loadable.sa";
import { store } from "./src/service/applicable/Redux.store.sa";

import Main from './src/infrastructure';


export default function App() {

  const [fontsLoaded] = loadFonts();

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView} >
        <Main />
      </View>
    </Provider>
  );
}