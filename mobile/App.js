import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, BackHandler, Platform, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { store, persistor } from './src/redux/store/store';
import HoldOnPopUp from './src/components/Modal/Center/HoldOnPopUp';
import FlashMessage from 'react-native-flash-message';
import AppStack from './src/routes/AppStack';
import { NativeWindStyleSheet } from "nativewind";
import * as SplashScreen from 'expo-splash-screen';

NativeWindStyleSheet.setOutput({
  default: "native",
});

SplashScreen.preventAutoHideAsync();

console.log = () => null;

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showHoldPopUp, setShowHoldPopUp] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, []);

  const backAction = useCallback(() => {
    if (store.getState().login.isLoggedIn === false) {
      setShowHoldPopUp(true);
    } else {
      BackHandler.exitApp();
    }
    return true;
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <NavigationContainer>
          <AppStack />
        </NavigationContainer>

      </PersistGate>
      <HoldOnPopUp
        visible={showHoldPopUp}
        onRequestClose={() => setShowHoldPopUp(false)}
        onRequestClear={() => {
          setShowHoldPopUp(false);
          BackHandler.exitApp();
        }}
      />
      <FlashMessage />
    </Provider>
  );
};



export default App;
