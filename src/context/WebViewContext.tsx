import React, { useEffect, useRef, useState, createContext } from "react";

import { View } from 'react-native';
import WebView, { WebViewMessageEvent } from "react-native-webview";

export interface WebViewParams {
  executarComando: any;
}

interface Comando {
  execucao: string;
  resolver?: any;
}

interface RetornoComando {
  tipo: string;
  retorno: string;
}

interface ComandoExecutado {
  execucao: string;
  retornoComando: RetornoComando;
}

const WebViewContext = createContext<WebViewParams | null>(null);

function WebViewProvider({ children }: any) {

  const webview = useRef<WebView | null>(null);

  const [comando, setComando] = useState<Comando | null>(null);

  const executarComando = (comandoExecutar: string): Promise<ComandoExecutado> => {

    return new Promise<ComandoExecutado>((resolve) => {

      const command = {
        execucao: comandoExecutar,
        resolver: (data: RetornoComando) => {
          resolve({
            execucao: comandoExecutar,
            retornoComando: data
          })
        }
      };
      setComando(command);
    });
  }

  useEffect(() => {
    if (webview !== null && webview.current !== null && comando != null) {
      webview.current.injectJavaScript(comando.execucao);
    }
  }, [comando]);

  const onMessage = (event: WebViewMessageEvent) => {
    if (comando) {
      comando.resolver(JSON.parse(event.nativeEvent.data))
    }
  }

  return (
    <WebViewContext.Provider value={{ executarComando }}>
      <View style={{ display: "none" }}>
        <WebView
          ref={webview}
          javaScriptEnabled={true}
          mixedContentMode={'compatibility'}
          originWhitelist={['*']}
          onMessage={onMessage}
          source={{
            html:
              `<html>
              <script>
              async function sendSucess(msg){
                window.ReactNativeWebView.postMessage('{"tipo": "sucess", "retorno": "'+ msg +'"}');
              }
              async function sendError(msg){
                window.ReactNativeWebView.postMessage('{"tipo": "error", "retorno": "'+ msg +'"}');
              }
              </script>
            </html>`
          }}
        />
      </View>
      {children}
    </WebViewContext.Provider>
  );
}

export { WebViewContext, WebViewProvider };
