import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import store from './src/store';
import ApplicationScreen from "./src/presentation/";
import Toast from '@phamhuuan/react-native-toast-message';
import LoadingMessage from "./src/presentation/components/LoadingMessage";

export default function App() {

  return (
    <Provider store={store}>
      <SafeAreaProvider >
        <ApplicationScreen />
        <Toast ref={(ref) => Toast.setRef(ref)} />
        <LoadingMessage />
      </SafeAreaProvider>
    </Provider >
  );
}