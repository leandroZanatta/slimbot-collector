import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import store from './src/store';
import ApplicationScreen from "./src/presentation";

export default function App() {

  return (
    <Provider store={store}>
      <SafeAreaProvider >
        <ApplicationScreen />
      </SafeAreaProvider>
    </Provider>
  );
}