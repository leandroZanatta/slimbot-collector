import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import useBase64 from './src/utilitarios/Base64';
import store from './src/store';
import ApplicationScreen from "./src/presentation";


export default function App() {

  const { atob, btoa } = useBase64();
  global.atob = atob;
  global.btoa = btoa;

  return (
    <Provider store={store}>
      <SafeAreaProvider >
        <ApplicationScreen />
      </SafeAreaProvider>
    </Provider>
  );
}