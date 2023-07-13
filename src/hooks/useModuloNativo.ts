import { NativeModules } from "react-native";

export default function useModuloNativo() {
  const { Collector } = NativeModules;

  const iniciarColeta = () => {
    Collector.iniciarWorker();
  };

  const forcarSincronizacao = async () => {
    await Collector.forcarSincronizacao();
  };

  return {
    forcarSincronizacao,
    iniciarColeta,
  };
}
