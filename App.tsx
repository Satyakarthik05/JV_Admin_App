import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import AppNavigation from './src/navigation/AppNavigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
//import HRlogin from './src/navigation/HRlogin'; // for Hr login
//import MasterNav from './src/navigation/MasterNav'; // for Master Login
///import TelecallerNav from './src/navigation/TelecallerNav';
import MainNav from './src/navigation/MainNav';

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <AppNavigation /> */}
        {/* <HRlogin/> */}
        {/* <MasterNav/> */}
        {/* <TelecallerNav/> */}
        <MainNav/>
      </GestureHandlerRootView>
    </Provider>
  );
}
